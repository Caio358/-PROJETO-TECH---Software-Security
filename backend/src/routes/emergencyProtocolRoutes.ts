
import { Router } from "express";

import {
    listarProtocolos,
    cadastrarProtocolo,
    atualizarStatusProtocolo
} from "../controllers/emergencyProtocolController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProtocoloEmergencia:
 *       type: object
 *       properties:
 *         id_protocolo:
 *           type: integer
 *           example: 1
 *         ocorrencia_id:
 *           type: integer
 *           example: 3
 *         servico:
 *           type: string
 *           enum: [POLICIA, BOMBEIROS]
 *           example: BOMBEIROS
 *         codigo_protocolo:
 *           type: string
 *           example: SIM-A1B2C3D4
 *         status:
 *           type: string
 *           enum: [CRIADO, ACIONADO, CONCLUIDO, CANCELADO]
 *           example: CRIADO
 *         simulado:
 *           type: boolean
 *           example: true
 *         data_hora:
 *           type: string
 *           format: date-time
 *         tipo_ocorrencia:
 *           type: string
 *           example: INCENDIO
 *         descricao_ocorrencia:
 *           type: string
 *           example: "Possível princípio de incêndio detectado."
 *
 *     NovoProtocolo:
 *       type: object
 *       required:
 *         - ocorrencia_id
 *         - servico
 *       properties:
 *         ocorrencia_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         servico:
 *           type: string
 *           enum: [POLICIA, BOMBEIROS]
 *           example: BOMBEIROS
 *
 *     ProtocoloRegistrado:
 *       type: object
 *       properties:
 *         id_protocolo:
 *           type: integer
 *           example: 1
 *         ocorrencia_id:
 *           type: integer
 *           example: 3
 *         servico:
 *           type: string
 *           enum: [POLICIA, BOMBEIROS]
 *           example: BOMBEIROS
 *         codigo_protocolo:
 *           type: string
 *           example: SIM-A1B2C3D4
 *         status:
 *           type: string
 *           enum: [CRIADO, ACIONADO, CONCLUIDO, CANCELADO]
 *           example: CRIADO
 *         simulado:
 *           type: boolean
 *           example: true
 *         data_hora:
 *           type: string
 *           format: date-time
 *
 *     AtualizacaoStatusProtocolo:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [CRIADO, ACIONADO, CONCLUIDO, CANCELADO]
 *           example: ACIONADO
 *
 *     RespostaProtocolo:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Protocolo simulado criado com sucesso!"
 *         protocolo:
 *           $ref: "#/components/schemas/ProtocoloRegistrado"
 */

/**
 * @swagger
 * /protocolos-emergencia:
 *   get:
 *     summary: Lista todos os protocolos de emergência simulados
 *     description: Retorna os protocolos registrados, incluindo informações da ocorrência relacionada. Nenhum serviço de emergência real é acionado.
 *     tags: [Protocolos de Emergência]
 *     responses:
 *       200:
 *         description: Lista de protocolos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProtocoloEmergencia"
 *       500:
 *         description: Erro interno ao listar protocolos.
 */
router.get("/", listarProtocolos);

/**
 * @swagger
 * /protocolos-emergencia:
 *   post:
 *     summary: Cria um protocolo de emergência simulado
 *     description: Gera automaticamente um código de protocolo e registra a simulação no banco. Não realiza contato com polícia ou bombeiros.
 *     tags: [Protocolos de Emergência]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NovoProtocolo"
 *     responses:
 *       201:
 *         description: Protocolo simulado criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaProtocolo"
 *       400:
 *         description: Dados inválidos ou erro ao criar protocolo.
 */
router.post("/", cadastrarProtocolo);

/**
 * @swagger
 * /protocolos-emergencia/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um protocolo simulado
 *     description: Altera o estado de acompanhamento do protocolo, sem acionar serviços reais.
 *     tags: [Protocolos de Emergência]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do protocolo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AtualizacaoStatusProtocolo"
 *     responses:
 *       200:
 *         description: Status do protocolo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaProtocolo"
 *       400:
 *         description: ID ou status inválido.
 *       404:
 *         description: Protocolo não encontrado.
 */
router.patch("/:id/status", atualizarStatusProtocolo);

export default router;
