import pool from "../config/database";
import { PoolClient } from "pg";

export async function listarTodas() {
    const resultado = await pool.query(`
        SELECT
            o.id_ocorrencia,
            o.sensor_id,
            s.nome AS sensor,
            s.ambiente,
            o.tipo,
            o.descricao,
            o.gravidade,
            o.origem,
            o.confianca,
            o.status,
            o.data_hora
        FROM ocorrencias o
        LEFT JOIN sensores s
            ON o.sensor_id = s.id_sensor
        ORDER BY o.data_hora DESC
    `);

    return resultado.rows;
}

export async function cadastrar(
    dados: {
        sensor_id: number | null;
        tipo: string;
        descricao: string;
        gravidade: string;
        origem: string;
    },
    client: PoolClient
) {
    const resultado = await client.query(
        `INSERT INTO ocorrencias
            (sensor_id, tipo, descricao, gravidade, origem)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
            dados.sensor_id,
            dados.tipo,
            dados.descricao,
            dados.gravidade,
            dados.origem
        ]
    );

    return resultado.rows[0];
}

export async function atualizarStatus(
    id: number,
    status: string
) {
    const resultado = await pool.query(
        `UPDATE ocorrencias
         SET status = $1
         WHERE id_ocorrencia = $2
         RETURNING *`,
        [status, id]
    );

    return resultado.rows[0] || null;
}