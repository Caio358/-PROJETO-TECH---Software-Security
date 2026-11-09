
import { PoolClient } from "pg";
import pool from "../config/database";

// Busca análises anômalas ainda não vinculadas a ocorrências.
export async function listarAnomaliasNaoVinculadas(client?: PoolClient) {
    const db = client || pool;

    const resultado = await db.query(`
        SELECT
            id_analise,
            classificacao,
            pontuacao,
            modelo_versao,
            caracteristicas,
            data_analise
        FROM analises_ml
        WHERE classificacao = 'ANOMALIA'
          AND ocorrencia_id IS NULL
        ORDER BY data_analise ASC
    `);

    return resultado.rows;
}

// Vincula uma análise de ML a uma ocorrência existente.
export async function vincularOcorrencia(
    idAnalise: number,
    idOcorrencia: number,
    client?: PoolClient
) {
    const db = client || pool;

    const resultado = await db.query(
        `UPDATE analises_ml
         SET ocorrencia_id = $1
         WHERE id_analise = $2
           AND ocorrencia_id IS NULL
         RETURNING *`,
        [idOcorrencia, idAnalise]
    );

    return resultado.rows[0] || null;
}
