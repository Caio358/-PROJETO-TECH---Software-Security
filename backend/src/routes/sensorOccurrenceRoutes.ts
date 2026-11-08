import { Router } from "express";

import {
    listarOcorrencias,
    cadastrarOcorrencia,
    atualizarStatusOcorrencia
} from "../controllers/sensorOccurrenceController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ocorrencia:
 *       type: object
 *       properties:
 *         id_ocorrencia:
 *           type: integer
 *           example: 1
 *         sensor_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         sensor:
 *           type: string
 *           nullable: true
 *           example: Sensor Porta Principal
 *         ambiente:
 *           type: string
 *           nullable: true
 *           example: Entrada
 *         tipo:
 *           type: string
 *           enum: [INVASAO, INCENDIO, ANOMALIA, FALHA_SENSOR]
 *           example: INVASAO
 *         descricao:
 *           type: string
 *           example: Possível movimentação detectada na entrada.
 *         gravidade:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA, CRITICA]
 *           example: ALTA
 *         origem:
 *           type: string
 *           enum: [ML, REGRA, MANUAL]
 *           example: REGRA
 *         confianca:
 *           type: number
 *           nullable: true
 *           example: 0.92
 *         status:
 *           type: string
 *           enum: [ABERTA, EM_ANALISE, RESOLVIDA, FALSO_POSITIVO]
 *           example: ABERTA
 *         data_hora:
 *           type: string
 *           format: date-time
 *
 *     NovaOcorrencia:
 *       type: object
 *       required:
 *         - tipo
 *         - descricao
 *         - gravidade
 *         - origem
 *       properties:
 *         sensor_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         tipo:
 *           type: string
 *           enum: [INVASAO, INCENDIO, ANOMALIA, FALHA_SENSOR]
 *           example: INVASAO
 *         descricao:
 *           type: string
 *           example: Possível movimentação detectada na entrada.
 *         gravidade:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA, CRITICA]
 *           example: ALTA
 *         origem:
 *           type: string
 *           enum: [ML, REGRA, MANUAL]
 *           example: REGRA
 *
 *     AtualizacaoStatusOcorrencia:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [ABERTA, EM_ANALISE, RESOLVIDA, FALSO_POSITIVO]
 *           example: EM_ANALISE
 *
 *     OcorrenciaRegistrada:
 *       type: object
 *       properties:
 *         id_ocorrencia:
 *           type: integer
 *           example: 1
 *         sensor_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         tipo:
 *           type: string
 *           example: INVASAO
 *         descricao:
 *           type: string
 *           example: Possível movimentação detectada na entrada.
 *         gravidade:
 *           type: string
 *           example: ALTA
 *         origem:
 *           type: string
 *           example: REGRA
 *         confianca:
 *           type: number
 *           nullable: true
 *           example: null
 *         status:
 *           type: string
 *           example: ABERTA
 *         data_hora:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /ocorrencias:
 *   get:
 *     summary: Lista todas as ocorrências registradas
 *     tags: [Ocorrências]
 *     responses:
 *       200:
 *         description: Ocorrências consultadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantidade:
 *                   type: integer
 *                   example: 5
 *                 ocorrencias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ocorrencia'
 *       500:
 *         description: Erro ao consultar ocorrências.
 */
router.get("/", listarOcorrencias);

/**
 * @swagger
 * /ocorrencias:
 *   post:
 *     summary: Registra uma nova ocorrência
 *     tags: [Ocorrências]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaOcorrencia'
 *     responses:
 *       201:
 *         description: Ocorrência registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Ocorrência registrada com sucesso!
 *                 ocorrencia:
 *                   $ref: '#/components/schemas/OcorrenciaRegistrada'
 *       400:
 *         description: Dados da ocorrência inválidos.
 *       500:
 *         description: Erro ao registrar ocorrência.
 */
router.post("/", cadastrarOcorrencia);

/**
 * @swagger
 * /ocorrencias/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma ocorrência
 *     tags: [Ocorrências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ocorrência.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizacaoStatusOcorrencia'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       400:
 *         description: ID ou status inválido.
 *       404:
 *         description: Ocorrência não encontrada.
 *       500:
 *         description: Erro ao atualizar ocorrência.
 */
router.patch("/:id/status", atualizarStatusOcorrencia);

export default router;