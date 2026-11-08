
from database import conectar_banco


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
                    l.unidade,
                    l.data_hora
                FROM leituras l
                INNER JOIN sensores s
                    ON l.sensor_id = s.id_sensor
                ORDER BY l.data_hora DESC
                LIMIT 100
            """)

            resultados = cursor.fetchall()

            for leitura in resultados:
                print(leitura)

            print(f"\nTotal de leituras consultadas: {len(resultados)}")

    finally:
        conexao.close()


if __name__ == "__main__":
    buscar_leituras()
