
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("A variável JWT_SECRET não foi configurada.");
}

interface AuthPayload extends JwtPayload {
  id: number;
  email: string;
  perfil: "ADMIN" | "MORADOR";
}

declare global {
  namespace Express {
    interface Request {
      usuario?: AuthPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem: "Token de autenticação não informado."
    });
  }

  const token = authorization.split(" ")[1];

  try {
        const decoded = jwt.verify(token, JWT_SECRET!) as unknown as AuthPayload;
    if (
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string" ||
      !["ADMIN", "MORADOR"].includes(decoded.perfil)
    ) {
      return res.status(401).json({
        mensagem: "Token inválido."
      });
    }

    req.usuario = decoded;

    next();
  } catch {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado."
    });
  }
}
