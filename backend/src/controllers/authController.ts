
import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      ...result
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Erro ao cadastrar usuário.";

    const status = message === "Este e-mail já está cadastrado."
      ? 409
      : 400;

    return res.status(status).json({
      mensagem: message
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      ...result
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Erro ao realizar login.";

    return res.status(401).json({
      mensagem: message
    });
  }
}
