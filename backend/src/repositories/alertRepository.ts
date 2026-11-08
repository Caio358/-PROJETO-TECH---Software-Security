
import pool from "../config/database";
import { PoolClient } from "pg";


export async function listarTodos() {
    const resultado = await pool.query(`
        SELECT
            a.id_alerta,
            a.ocorrencia_id,
            a.usuario_id,
            a.mensagem,
            a.status,
            a.data_hora,
            o.tipo AS tipo_ocorrencia,
            u.nome AS nome_usuario
        FROM alertas a
        INNER JOIN ocorrencias o
            ON a.ocorrencia_id = o.id_ocorrencia
        LEFT JOIN usuarios u
            ON a.usuario_id = u.id_usuario
        ORDER BY a.data_hora DESC
    `);

    return resultado.rows;
}

export async function cadastrar(
    dados: {
        ocorrencia_id: number;
        usuario_id?: number | null;
        mensagem: string;
    },
    client?: PoolClient
) {
    const conexao = client ?? pool;

    const resultado = await conexao.query(
        `INSERT INTO alertas
            (ocorrencia_id, usuario_id, mensagem)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
            dados.ocorrencia_id,
            dados.usuario_id ?? null,
            dados.mensagem
        ]
    );

    return resultado.rows[0];
}

export async function atualizarStatus(
    id: number,
    status: string
) {
    const resultado = await pool.query(
        `UPDATE alertas
         SET status = $1
         WHERE id_alerta = $2
         RETURNING *`,
        [status, id]
    );

    return resultado.rows[0] || null;
}
