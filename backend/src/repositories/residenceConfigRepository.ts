import pool from "../config/database";

export type ModoSeguranca = "ARMADO" | "DESARMADO";

export async function consultarConfiguracao() {
    const resultado = await pool.query(`
        SELECT
            id,
            modo_seguranca,
            atualizado_em,
            atualizado_por
        FROM configuracao_residencia
        WHERE id = 1
    `);

    return resultado.rows[0] || null;
}

export async function atualizarModoSeguranca(
    modo: ModoSeguranca,
    usuarioId: number | null = null
) {
    const resultado = await pool.query(
        `
        UPDATE configuracao_residencia
        SET modo_seguranca = $1,
            atualizado_em = NOW(),
            atualizado_por = $2
        WHERE id = 1
        RETURNING *
        `,
        [modo, usuarioId]
    );

    return resultado.rows[0] || null;
}
