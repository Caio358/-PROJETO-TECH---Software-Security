
from fastapi import FastAPI, HTTPException

from database import conectar_banco
from ml_model import analisar_leituras, salvar_analises

app = FastAPI(
    title="Software Security - Serviço de Inteligência Artificial",
    description="API responsável pela análise inteligente dos sensores.",
    version="1.0.0"
)


@app.get("/")
def inicio():
    return {
        "mensagem": "Serviço de Machine Learning do Software Security ativo."
    }


@app.get("/health")
def verificar_saude():
    try:
        conexao = conectar_banco()
        conexao.close()

        return {
            "status": "online",
            "banco": "conectado"
        }

    except Exception as erro:
        raise HTTPException(
            status_code=503,
            detail=f"Erro na conexão com o banco: {str(erro)}"
        )

@app.post("/analisar")
def executar_analise():
    try:
        resultados = analisar_leituras()
        total_salvo = salvar_analises(resultados)

        anomalias = [
            {
                "id_leitura": item["id_leitura"],
                "sensor_id": item["sensor_id"],
                "sensor": item["sensor"],
                "tipo": item["tipo"],
                "valor": item["valor"],
                "classificacao": item["classificacao"],
                "pontuacao": item["pontuacao"]
            }
            for item in resultados
            if item["classificacao"] == "ANOMALIA"
        ]

        return {
            "mensagem": "Análise concluída.",
            "total_analisado": len(resultados),
            "total_anomalias": len(anomalias),
            "total_salvo": total_salvo,
            "anomalias": anomalias
        }

    except Exception as erro:
        raise HTTPException(
            status_code=500,
            detail=f"Erro durante a análise: {str(erro)}"
        )
