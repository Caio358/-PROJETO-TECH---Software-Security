
import { Router } from "express";
import { analisarSensores } from "../controllers/mlController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AnomaliaML:
 *       type: object
 *       properties:
 *         id_leitura:
 *           type: integer
 *           example: 25
 *         sensor_id:
 *           type: integer
 *           example: 3
 *         sensor:
 *           type: string
 *           example: "Sensor Porta Principal"
 *         tipo:
 *           type: string
 *           example: PORTA
 *         valor:
 *           type: number
 *           example: 1
 *         classificacao:
 *           type: string
 *           enum: [ANOMALIA]
 *           example: ANOMALIA
 *         pontuacao:
 *           type: number
 *           description: Pontuação normalizada de anomalia, não representa uma probabilidade.
 *           example: 0.87
 *
 *     ResultadoMachineLearning:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Análise concluída."
 *         total_analisado:
 *           type: integer
 *           example: 301
 *         total_anomalias:
 *           type: integer
 *           example: 17
 *         total_salvo:
 *           type: integer
 *           example: 10
 *         anomalias:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/AnomaliaML"
 *
 *     OcorrenciaRegra:
 *       type: object
 *       properties:
 *         id_ocorrencia:
 *           type: integer
 *           example: 5
 *         tipo:
 *           type: string
 *           enum: [INVASAO, INCENDIO]
 *           example: INCENDIO
 *
 *     ResultadoMotorRegras:
 *       type: object
 *       properties:
 *         total_ocorrencias_criadas:
 *           type: integer
 *           example: 1
 *         ocorrencias:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/OcorrenciaRegra"
 *
 *     RespostaAnaliseSeguranca:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Análise de segurança concluída."
 *         machine_learning:
 *           $ref: "#/components/schemas/ResultadoMachineLearning"
 *         motor_de_regras:
 *           $ref: "#/components/schemas/ResultadoMotorRegras"
 *
 *     ErroAnaliseSeguranca:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Não foi possível concluir a análise de segurança."
 *         erro:
 *           type: string
 *           example: "Falha no serviço ML."
 */

/**
 * @swagger
 * /ml/analisar:
 *   post:
 *     summary: Executa a análise inteligente dos sensores
 *     description: >
 *       Executa o serviço de Machine Learning para identificar anomalias
 *       estatísticas nas leituras e, em seguida, executa o motor de regras
 *       para avaliar possíveis situações de invasão e incêndio.
 *       O motor de regras pode registrar ocorrências e alertas no banco.
 *     tags: [Machine Learning]
 *     responses:
 *       200:
 *         description: Análise de segurança concluída.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespostaAnaliseSeguranca"
 *       502:
 *         description: Falha na comunicação ou execução dos serviços de análise.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroAnaliseSeguranca"
 */
router.post("/analisar", analisarSensores);

export default router;
