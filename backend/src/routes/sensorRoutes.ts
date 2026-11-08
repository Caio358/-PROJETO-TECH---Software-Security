import { Router } from "express";

import {
    listarSensores,
    cadastrarSensor,
    atualizarSensor,
    excluirSensor
} from "../controllers/sensorController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       properties:
 *         id_sensor:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Sensor de Movimento Sala
 *         tipo:
 *           type: string
 *           enum: [PRESENCA, MOVIMENTO, PORTA, JANELA, TEMPERATURA, FUMACA]
 *           example: MOVIMENTO
 *         ambiente:
 *           type: string
 *           example: Sala
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, MANUTENCAO]
 *           example: ATIVO
 *         criado_em:
 *           type: string
 *           format: date-time
 *
 *     SensorCadastro:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - ambiente
 *       properties:
 *         nome:
 *           type: string
 *           example: Sensor de Movimento Sala
 *         tipo:
 *           type: string
 *           enum: [PRESENCA, MOVIMENTO, PORTA, JANELA, TEMPERATURA, FUMACA]
 *           example: MOVIMENTO
 *         ambiente:
 *           type: string
 *           example: Sala
 *
 *     SensorAtualizacao:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - ambiente
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *           example: Sensor de Movimento Sala
 *         tipo:
 *           type: string
 *           enum: [PRESENCA, MOVIMENTO, PORTA, JANELA, TEMPERATURA, FUMACA]
 *           example: MOVIMENTO
 *         ambiente:
 *           type: string
 *           example: Sala
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, MANUTENCAO]
 *           example: ATIVO
 *
 *     MensagemResposta:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: Operação realizada com sucesso!
 */

/**
 * @swagger
 * /sensores:
 *   get:
 *     summary: Lista todos os sensores
 *     tags: [Sensores]
 *     responses:
 *       200:
 *         description: Sensores consultados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantidade:
 *                   type: integer
 *                   example: 6
 *                 sensores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sensor'
 *       500:
 *         description: Erro interno ao consultar os sensores.
 */
router.get("/", listarSensores);

/**
 * @swagger
 * /sensores:
 *   post:
 *     summary: Cadastra um novo sensor
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorCadastro'
 *     responses:
 *       201:
 *         description: Sensor cadastrado com sucesso.
 *       400:
 *         description: Dados incorretos ou tipo de sensor inválido.
 *       500:
 *         description: Erro interno ao cadastrar sensor.
 */
router.post("/", cadastrarSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   put:
 *     summary: Atualiza um sensor existente
 *     tags: [Sensores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sensor.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorAtualizacao'
 *     responses:
 *       200:
 *         description: Sensor atualizado com sucesso.
 *       400:
 *         description: ID ou dados inválidos.
 *       404:
 *         description: Sensor não encontrado.
 *       500:
 *         description: Erro interno ao atualizar sensor.
 */
router.put("/:id", atualizarSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   delete:
 *     summary: Exclui um sensor
 *     tags: [Sensores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sensor.
 *         example: 1
 *     responses:
 *       200:
 *         description: Sensor excluído com sucesso.
 *       404:
 *         description: Sensor não encontrado.
 *       500:
 *         description: Erro interno ao excluir sensor.
 */
router.delete("/:id", excluirSensor);

export default router;