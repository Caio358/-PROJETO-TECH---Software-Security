import { Router } from "express";

import {
    listarLeituras,
    cadastrarLeitura
} from "../controllers/sensorReadingController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Leitura:
 *       type: object
 *       properties:
 *         id_leitura:
 *           type: integer
 *           example: 1
 *         sensor_id:
 *           type: integer
 *           example: 3
 *         sensor:
 *           type: string
 *           example: Sensor Porta Principal
 *         tipo:
 *           type: string
 *           example: PORTA
 *         ambiente:
 *           type: string
 *           example: Entrada
 *         valor:
 *           type: number
 *           example: 1
 *         unidade:
 *           type: string
 *           example: estado
 *         data_hora:
 *           type: string
 *           format: date-time
 *
 *     NovaLeitura:
 *       type: object
 *       required:
 *         - sensor_id
 *         - valor
 *         - unidade
 *       properties:
 *         sensor_id:
 *           type: integer
 *           example: 3
 *         valor:
 *           type: number
 *           example: 1
 *         unidade:
 *           type: string
 *           example: estado
 *
 *     LeituraRegistrada:
 *       type: object
 *       properties:
 *         id_leitura:
 *           type: integer
 *           example: 10
 *         sensor_id:
 *           type: integer
 *           example: 3
 *         valor:
 *           type: number
 *           example: 1
 *         unidade:
 *           type: string
 *           example: estado
 *         data_hora:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /leituras:
 *   get:
 *     summary: Lista todas as leituras dos sensores
 *     tags: [Leituras]
 *     responses:
 *       200:
 *         description: Leituras consultadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantidade:
 *                   type: integer
 *                   example: 10
 *                 leituras:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Leitura'
 *       500:
 *         description: Erro ao consultar as leituras.
 */
router.get("/", listarLeituras);

/**
 * @swagger
 * /leituras:
 *   post:
 *     summary: Registra uma nova leitura de sensor
 *     tags: [Leituras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaLeitura'
 *     responses:
 *       201:
 *         description: Leitura registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Leitura registrada com sucesso!
 *                 leitura:
 *                   $ref: '#/components/schemas/LeituraRegistrada'
 *       400:
 *         description: Dados enviados em formato inválido.
 *       500:
 *         description: Erro ao registrar leitura. Verifique se o sensor existe.
 */
router.post("/", cadastrarLeitura);

export default router;