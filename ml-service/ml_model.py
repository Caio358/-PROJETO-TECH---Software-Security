
import pandas as pd
from sklearn.ensemble import IsolationForest
from psycopg.types.json import Jsonb

from database import conectar_banco


VERSAO_MODELO = "IsolationForest-v3"

TIPOS_ANALISADOS = [
    "TEMPERATURA",
    "FUMACA"
]


def buscar_leituras():
    conexao = conectar_banco()

    try:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    l.id_leitura,
                    l.sensor_id,
                    s.nome AS sensor,
                    s.tipo,
                    l.valor,
                    l.data_hora
                FROM leituras l
                INNER JOIN sensores s
                    ON l.sensor_id = s.id_sensor
                WHERE s.tipo IN ('TEMPERATURA', 'FUMACA')
                ORDER BY l.data_hora ASC, l.id_leitura ASC
            """)

            resultados = cursor.fetchall()

        colunas = [
            "id_leitura",
            "sensor_id",
            "sensor",
            "tipo",
            "valor",
            "data_hora"
        ]

        return pd.DataFrame(resultados, columns=colunas)

    finally:
        conexao.close()


def analisar_leituras():
    dados = buscar_leituras()

    if dados.empty:
        return []

    resultados = []

    for sensor_id, grupo in dados.groupby("sensor_id"):

        grupo = grupo.copy()

        grupo["valor"] = pd.to_numeric(
            grupo["valor"],
            errors="coerce"
        )

        grupo = grupo.dropna(subset=["valor"])

        grupo = grupo.sort_values(
            ["data_hora", "id_leitura"]
        ).reset_index(drop=True)

        if len(grupo) < 25:
            continue

        if grupo["valor"].nunique() < 2:
            continue

        # Características temporais.
        grupo["variacao"] = grupo["valor"].diff().fillna(0)

        grupo["media_movel"] = (
            grupo["valor"]
            .rolling(window=5, min_periods=1)
            .mean()
        )

        caracteristicas = grupo[
            ["valor", "variacao", "media_movel"]
        ]

        # Separação cronológica:
        # 80% para treinamento e 20% para avaliação.
        ponto_corte = int(len(grupo) * 0.8)

        dados_treino = caracteristicas.iloc[:ponto_corte]
        dados_teste = caracteristicas.iloc[ponto_corte:]

        if len(dados_treino) < 20 or dados_teste.empty:
            continue

        modelo = IsolationForest(
            contamination=0.05,
            random_state=42
        )

        modelo.fit(dados_treino)

        previsoes = modelo.predict(dados_teste)
        pontuacoes = modelo.decision_function(dados_teste)

        for indice, previsao in enumerate(previsoes):

            leitura = grupo.iloc[ponto_corte + indice]

            score_bruto = float(pontuacoes[indice])

            # Indicador normalizado entre 0 e 1.
            # Não representa uma probabilidade.
            pontuacao = max(
                0.0,
                min(1.0, 0.5 - score_bruto)
            )

            resultados.append({
                "id_leitura": int(leitura["id_leitura"]),
                "sensor_id": int(sensor_id),
                "sensor": leitura["sensor"],
                "tipo": leitura["tipo"],
                "valor": float(leitura["valor"]),
                "variacao": float(leitura["variacao"]),
                "media_movel": float(leitura["media_movel"]),
                "classificacao": (
                    "ANOMALIA" if previsao == -1 else "NORMAL"
                ),
                "pontuacao": pontuacao
            })

    return resultados


def salvar_analises(resultados):
    if not resultados:
        return 0

    conexao = conectar_banco()
    total_salvo = 0

    try:
        with conexao.cursor() as cursor:

            for resultado in resultados:

                caracteristicas_json = {
                    "id_leitura": resultado["id_leitura"],
                    "sensor_id": resultado["sensor_id"],
                    "tipo_sensor": resultado["tipo"],
                    "valor": resultado["valor"],
                    "variacao": resultado["variacao"],
                    "media_movel": resultado["media_movel"]
                }

                cursor.execute("""
                    INSERT INTO analises_ml (
                        classificacao,
                        pontuacao,
                        modelo_versao,
                        caracteristicas
                    )
                    SELECT %s, %s, %s, %s
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM analises_ml
                        WHERE caracteristicas->>'id_leitura' = %s
                          AND modelo_versao = %s
                    )
                """, (
                    resultado["classificacao"],
                    resultado["pontuacao"],
                    VERSAO_MODELO,
                    Jsonb(caracteristicas_json),
                    str(resultado["id_leitura"]),
                    VERSAO_MODELO
                ))

                total_salvo += cursor.rowcount

        conexao.commit()

        return total_salvo

    except Exception:
        conexao.rollback()
        raise

    finally:
        conexao.close()


if __name__ == "__main__":

    analises = analisar_leituras()

    total_salvo = salvar_analises(analises)

    total_anomalias = sum(
        1 for item in analises
        if item["classificacao"] == "ANOMALIA"
    )

    print(f"Modelo: {VERSAO_MODELO}")
    print(f"Total de leituras avaliadas: {len(analises)}")
    print(f"Anomalias identificadas: {total_anomalias}")
    print(f"Análises novas salvas no banco: {total_salvo}")
