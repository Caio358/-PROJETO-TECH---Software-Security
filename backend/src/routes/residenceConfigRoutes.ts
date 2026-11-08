import { Router } from "express";

import {
    consultarModoSeguranca,
    alterarModoSeguranca
} from "../controllers/residenceConfigController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracaoResidencia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         modo_seguranca:
 *           type: string
 *           enum: [ARMADO, DESARMADO]
 *           example: DESARMADO
 *         atualizado_em:
 *           type: string
 *           format: date-time
 *         atualizado_por:
 *           type: integer
 *           nullable: true
 *
 *     AlteracaoModoSeguranca:
 *       type: object
 *       required:
 *         - modo
 *       properties:
 *         modo:
 *           type: string
 *           enum: [ARMADO, DESARMADO]
 *           example: ARMADO
 */

/**
 * @swagger
 * /configuracao-residencia:
 *   get:
 *     summary: Consulta o modo de segurança da residência
 *     tags: [Configuração da Residência]
 *     responses:
 *       200:
 *         description: Configuração consultada com sucesso.
 *       500:
 *         description: Erro interno ao consultar a configuração.
 */
router.get("/", consultarModoSeguranca);

/**
 * @swagger
 * /configuracao-residencia/modo-seguranca:
 *   patch:
 *     summary: Altera o modo de segurança da residência
 *     tags: [Configuração da Residência]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlteracaoModoSeguranca'
 *     responses:
 *       200:
 *         description: Modo de segurança alterado com sucesso.
 *       400:
 *         description: Modo informado inválido.
 *       500:
 *         description: Erro interno ao alterar o modo.
 */
router.patch("/modo-seguranca", alterarModoSeguranca);

export default router;
