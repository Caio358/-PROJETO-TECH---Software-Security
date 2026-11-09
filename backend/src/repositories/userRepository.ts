
import pool from "../config/database";

export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: "ADMIN" | "MORADOR";
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id_usuario, nome, email, senha_hash, perfil
     FROM usuarios
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

export async function createUser(
  nome: string,
  email: string,
  senhaHash: string
): Promise<User> {
  const result = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, perfil)
     VALUES ($1, $2, $3, 'MORADOR')
     RETURNING id_usuario, nome, email, senha_hash, perfil`,
    [nome, email, senhaHash]
  );

  return result.rows[0];
}
