
import { Router } from "express";

import {
    consultarContexto,
    enviarMensagem
} from "../controllers/chatController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Consulta inteligente do estado da residência.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PerguntaChat:
 *       type: object
 *       required:
 *         - pergunta
 *       properties:
 *         pergunta:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: "Existem ocorrências críticas na residência?"
 *
 *     RespostaChat:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Resposta gerada com sucesso."
 *         resposta:
 *           type: string
 *           example: "Existem duas ocorrências críticas pendentes."
 *
 *     ContextoChat:
 *       type: object
 *       properties:
 *         resumo_situacao:
 *           type: string
 *           enum:
 *             - MONITORAMENTO_LIMITADO
 *             - OCORRENCIAS_CRITICAS_PENDENTES
 *             - OCORRENCIAS_PENDENTES
 *             - SEM_OCORRENCIAS_PENDENTES
 *         sensores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_sensor:
 *                 type: integer
 *               nome:
 *                 type: string
 *               tipo:
 *                 type: string
 *               ambiente:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ATIVO, INATIVO, MANUTENCAO]
 *               valor:
 *                 type: number
 *                 nullable: true
 *               unidade:
 *                 type: string
 *                 nullable: true
 *               data_hora:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               idade_segundos:
 *                 type: integer
 *                 nullable: true
 *               leitura_desatualizada:
 *                 type: boolean
 *               estado_leitura:
 *                 type: string
 *                 enum: [SEM_LEITURA, DESATUALIZADA, RECENTE]
 *         indicadores_sensores:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             ativos:
 *               type: integer
 *             inativos:
 *               type: integer
 *             em_manutencao:
 *               type: integer
 *             leituras_recentes:
 *               type: integer
 *             leituras_desatualizadas:
 *               type: integer
 *             sem_leitura:
 *               type: integer
 *         ocorrencias_abertas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_ocorrencia:
 *                 type: integer
 *               tipo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               gravidade:
 *                 type: string
 *               origem:
 *                 type: string
 *               status:
 *                 type: string
 *               data_hora:
 *                 type: string
 *                 format: date-time
 *               idade_segundos:
 *                 type: integer
 *               sensor:
 *                 type: string
 *                 nullable: true
 *         indicadores_ocorrencias:
 *           type: object
 *           properties:
 *             total_pendentes:
 *               type: integer
 *             total_criticas:
 *               type: integer
 *         alertas_pendentes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_alerta:
 *                 type: integer
 *               ocorrencia_id:
 *                 type: integer
 *               mensagem:
 *                 type: string
 *               status:
 *                 type: string
 *               data_hora:
 *                 type: string
 *                 format: date-time
 *               idade_segundos:
 *                 type: integer
 *               tipo_ocorrencia:
 *                 type: string
 *                 nullable: true
 *               gravidade:
 *                 type: string
 *                 nullable: true
 *         total_alertas_pendentes:
 *           type: integer
 *         limite_desatualizacao_segundos:
 *           type: integer
 *         consultado_em:
 *           type: string
 *           format: date-time
 *
 *     ErroChat:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Informe uma pergunta válida."
 */

/**
 * @swagger
 * /chat/contexto:
 *   get:
 *     summary: Consultar contexto da residência
 *     description: Retorna informações atualizadas sobre sensores, leituras, ocorrências e alertas pendentes.
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Contexto consultado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 contexto:
 *                   $ref: '#/components/schemas/ContextoChat'
 *       500:
 *         description: Erro ao consultar os dados da residência.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroChat'
 */
router.get("/contexto", consultarContexto);

/**
 * @swagger
 * /chat/mensagem:
 *   post:
 *     summary: Enviar pergunta ao chatbot
 *     description: Envia uma pergunta e utiliza o contexto atual da residência para gerar uma resposta por inteligência artificial.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerguntaChat'
 *     responses:
 *       200:
 *         description: Resposta gerada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaChat'
 *       400:
 *         description: Pergunta inválida ou com mais de 2000 caracteres.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroChat'
 *       502:
 *         description: Não foi possível obter uma resposta da IA.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroChat'
 *       503:
 *         description: Assistente de IA ainda não configurado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroChat'
 */
router.post("/mensagem", enviarMensagem);

export default router;
