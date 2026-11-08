
import { Router } from "express";

import {
    listarAlertas,
    cadastrarAlerta,
    atualizarStatusAlerta
} from "../controllers/alertController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Alerta:
 *       type: object
 *       properties:
 *         id_alerta:
 *           type: integer
 *           example: 1
 *         ocorrencia_id:
 *           type: integer
 *           example: 3
 *         usuario_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         mensagem:
 *           type: string
 *           example: "Alerta de possível invasão detectada."
 *         status:
 *           type: string
 *           enum: [PENDENTE, ENVIADO, LIDO]
 *           example: PENDENTE
 *         data_hora:
 *           type: string
 *           format: date-time
 *         tipo_ocorrencia:
 *           type: string
 *           example: INVASAO
 *         nome_usuario:
 *           type: string
 *           nullable: true
 *           example: "André"
 *
 *     NovoAlerta:
 *       type: object
 *       required:
 *         - ocorrencia_id
 *         - mensagem
 *       properties:
 *         ocorrencia_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         usuario_id:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           example: 1
 *         mensagem:
 *           type: string
 *           minLength: 1
 *           example: "Alerta de possível invasão detectada."
 *
 *     AlertaRegistrado:
 *       type: object
 *       properties:
 *         id_alerta:
 *           type: integer
 *           example: 1
 *         ocorrencia_id:
 *           type: integer
 *           example: 3
 *         usuario_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         mensagem:
 *           type: string
 *           example: "Alerta de possível invasão detectada."
 *         status:
 *           type: string
 *           enum: [PENDENTE, ENVIADO, LIDO]
 *           example: PENDENTE
 *         data_hora:
 *           type: string
 *           format: date-time
 *
 *     AtualizacaoStatusAlerta:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDENTE, ENVIADO, LIDO]
 *           example: LIDO
 *
 *     RespostaAlerta:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Alerta cadastrado com sucesso!"
 *         alerta:
 *           $ref: "#/components/schemas/AlertaRegistrado"
 */

/**
 * @swagger
 * /alertas:
 *   get:
 *     summary: Lista todos os alertas
 *     tags: [Alertas]
 *     responses:
 *       200:
 *         description: Lista de alertas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Alerta"
 *       500:
 *         description: Erro interno ao listar alertas.
 */
router.get("/", listarAlertas);

/**
 * @swagger
 * /alertas:
 *   post:
 *     summary: Cadastra um novo alerta
 *     tags: [Alertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NovoAlerta"
 *     responses:
 *       201:
 *         description: Alerta cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaAlerta"
 *       400:
 *         description: Dados inválidos ou erro ao cadastrar alerta.
 */
router.post("/", cadastrarAlerta);

/**
 * @swagger
 * /alertas/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do alerta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AtualizacaoStatusAlerta"
 *     responses:
 *       200:
 *         description: Status do alerta atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaAlerta"
 *       400:
 *         description: ID ou status inválido.
 *       404:
 *         description: Alerta não encontrado.
 */
router.patch("/:id/status", atualizarStatusAlerta);

export default router;
