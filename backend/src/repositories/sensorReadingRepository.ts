import pool from "../config/database";

export async function listarTodas() {
    const resultado = await pool.query(`
        SELECT
            l.id_leitura,
            l.sensor_id,
            s.nome AS sensor,
            s.tipo,
            s.ambiente,
            l.valor,
            l.unidade,
            l.data_hora
        FROM leituras l
        INNER JOIN sensores s
            ON l.sensor_id = s.id_sensor
        ORDER BY l.data_hora DESC
    `);

    return resultado.rows;
}

export async function cadastrar(dados: {
    sensor_id: number;
    valor: number;
    unidade: string;
}) {
    const resultado = await pool.query(
        `INSERT INTO leituras (sensor_id, valor, unidade)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
            dados.sensor_id,
            dados.valor,
            dados.unidade
        ]
    );

    return resultado.rows[0];
}