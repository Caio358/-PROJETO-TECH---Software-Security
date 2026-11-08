import pool from "../config/database";

export async function listarTodos() {
    const resultado = await pool.query(
        "SELECT * FROM sensores ORDER BY id_sensor ASC"
    );

    return resultado.rows;
}

export async function cadastrar(dados: {
    nome: string;
    tipo: string;
    ambiente: string;
    status: string;
}) {
    const resultado = await pool.query(
        `INSERT INTO sensores (nome, tipo, ambiente, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [dados.nome, dados.tipo, dados.ambiente, dados.status]
    );

    return resultado.rows[0];
}

export async function atualizar(
    id: number,
    dados: {
        nome: string;
        tipo: string;
        ambiente: string;
        status: string;
    }
) {
    const resultado = await pool.query(
        `UPDATE sensores
         SET nome = $1,
             tipo = $2,
             ambiente = $3,
             status = $4
         WHERE id_sensor = $5
         RETURNING *`,
        [
            dados.nome,
            dados.tipo,
            dados.ambiente,
            dados.status,
            id
        ]
    );

    return resultado.rows[0] || null;
}

export async function excluir(id: number) {
    const resultado = await pool.query(
        `DELETE FROM sensores
         WHERE id_sensor = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0] || null;
}


export async function listarAtivos() {
    const resultado = await pool.query(`
        SELECT id_sensor, nome, tipo
        FROM sensores
        WHERE status = 'ATIVO'
        ORDER BY id_sensor
    `);

    return resultado.rows as {
        id_sensor: number;
        nome: string;
        tipo: string;
    }[];
}
