
import { Router } from "express";

import {
    iniciar,
    parar,
    status,
    selecionarCenario
} from "../controllers/simulatorController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RespostaSimulador:
 *       type: object
 *       properties:
 *         ativo:
 *           type: boolean
 *           example: true
 *         mensagem:
 *           type: string
 *           example: "Simulador iniciado com sucesso."
 *
 *     StatusSimulador:
 *       type: object
 *       properties:
 *         ativo:
 *           type: boolean
 *           example: true
 *         intervalo_segundos:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /simulador/iniciar:
 *   post:
 *     summary: Inicia o simulador de sensores
 *     description: Inicia a geração automática de leituras para todos os sensores ativos. Uma primeira geração acontece imediatamente e as próximas ocorrem a cada 10 segundos.
 *     tags: [Simulador]
 *     responses:
 *       200:
 *         description: Simulador iniciado ou já estava em execução.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaSimulador"
 *       500:
 *         description: Erro interno ao iniciar o simulador.
 */
router.post("/iniciar", iniciar);

/**
 * @swagger
 * /simulador/parar:
 *   post:
 *     summary: Para o simulador de sensores
 *     description: Interrompe a geração automática de leituras. Caso já esteja parado, informa essa condição.
 *     tags: [Simulador]
 *     responses:
 *       200:
 *         description: Simulador parado ou já estava parado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaSimulador"
 */
router.post("/parar", parar);

/**
 * @swagger
 * /simulador/status:
 *   get:
 *     summary: Consulta o estado do simulador
 *     description: Retorna se o simulador está ativo e o intervalo de geração de leituras em segundos.
 *     tags: [Simulador]
 *     responses:
 *       200:
 *         description: Estado atual do simulador.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StatusSimulador"
 */
router.get("/status", status);


/**
 * @swagger
 * /simulador/cenario:
 *   post:
 *     summary: Seleciona um cenário de simulação
 *     tags: [Simulador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cenario
 *             properties:
 *               cenario:
 *                 type: string
 *                 enum:
 *                   - NORMAL
 *                   - VARIACAO_INCOMUM
 *                   - TESTE_FUMACA
 *                   - TESTE_TEMPERATURA
 *     responses:
 *       200:
 *         description: Cenário selecionado.
 *       400:
 *         description: Cenário inválido.
 */
router.post("/cenario", selecionarCenario);

export default router;
