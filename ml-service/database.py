
import os

import psycopg
from dotenv import load_dotenv

load_dotenv()


def conectar_banco():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        dbname=os.getenv("DB_NAME")
    )


if __name__ == "__main__":
    try:
        conexao = conectar_banco()

        print("Conexão com PostgreSQL estabelecida!")

        conexao.close()

    except Exception as erro:
        print("Erro ao conectar ao banco:")
        print(erro)
