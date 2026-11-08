import { PoolClient } from "pg";
import pool from "../config/database";

export async function listarTodos() {
    const resultado = await pool.query(`
        SELECT
            p.id_protocolo,
            p.ocorrencia_id,
            p.servico,
            p.codigo_protocolo,
            p.status,
            p.simulado,
            p.data_hora,
            o.tipo AS tipo_ocorrencia,
            o.descricao AS descricao_ocorrencia
        FROM protocolos_emergencia p
        INNER JOIN ocorrencias o
            ON p.ocorrencia_id = o.id_ocorrencia
        ORDER BY p.data_hora DESC
    `);

    return resultado.rows;
}

export async function cadastrar(dados: {
    ocorrencia_id: number;
    servico: string;
    codigo_protocolo: string;
}) {
    const resultado = await pool.query(
        `INSERT INTO protocolos_emergencia
            (ocorrencia_id, servico, codigo_protocolo, simulado)
         VALUES ($1, $2, $3, TRUE)
         RETURNING *`,
        [
            dados.ocorrencia_id,
            dados.servico,
            dados.codigo_protocolo
        ]
    );

    return resultado.rows[0];
}

export async function atualizarStatus(
    id: number,
    status: string
) {
    const resultado = await pool.query(
        `UPDATE protocolos_emergencia
         SET status = $1
         WHERE id_protocolo = $2
         RETURNING *`,
        [status, id]
    );

    return resultado.rows[0] || null;
}

export async function cadastrarNaTransacao(
    conexao: PoolClient,
    dados: {
        ocorrencia_id: number;
        servico: string;
        codigo_protocolo: string;
    }
) {
    const resultado = await conexao.query(
        `INSERT INTO protocolos_emergencia
            (ocorrencia_id, servico, codigo_protocolo, simulado)
         VALUES ($1, $2, $3, TRUE)
         RETURNING *`,
        [
            dados.ocorrencia_id,
            dados.servico,
            dados.codigo_protocolo
        ]
    );

    return resultado.rows[0];
}