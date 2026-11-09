
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  User
} from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("A variável JWT_SECRET não foi configurada.");
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

interface LoginData {
  email: string;
  senha: string;
}

function createToken(user: User): string {
  return jwt.sign(
    {
      id: user.id_usuario,
      email: user.email,
      perfil: user.perfil
    },
    JWT_SECRET as string,
    { expiresIn: "8h" }
  );
}

export async function register(data: RegisterData) {
  const nome = data.nome?.trim();
  const email = data.email?.trim().toLowerCase();
  const senha = data.senha;

  if (!nome || !email || !senha) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (senha.length < 6) {
    throw new Error("A senha deve possuir pelo menos 6 caracteres.");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  const user = await createUser(nome, email, senhaHash);
  const token = createToken(user);

  return {
    usuario: {
      id: user.id_usuario,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil
    },
    token
  };
}

export async function login(data: LoginData) {
  const email = data.email?.trim().toLowerCase();
  const senha = data.senha;

  if (!email || !senha) {
    throw new Error("Informe o e-mail e a senha.");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  const passwordMatches = await bcrypt.compare(senha, user.senha_hash);

  if (!passwordMatches) {
    throw new Error("E-mail ou senha incorretos.");
  }

  const token = createToken(user);

  return {
    usuario: {
      id: user.id_usuario,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil
    },
    token
  };
}
