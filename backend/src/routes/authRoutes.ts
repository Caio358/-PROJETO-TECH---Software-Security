
import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Autenticação]
 */
router.post("/", register);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Autenticação]
 */
router.post("/login", login);

export default router;
