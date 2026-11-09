
import { Request, Response } from "express";
import { executarAnaliseML } from "../services/mlService";
import { avaliarRegrasSeguranca } from "../services/securityRuleService";

export async function analisarSensores(
    req: Request,
    res: Response
) {
    try {
        const resultadoML = await executarAnaliseML();

        const resultadoSeguranca =
            await avaliarRegrasSeguranca();

        return res.status(200).json({
            mensagem: "Análise de segurança concluída.",

            machine_learning: resultadoML.machine_learning,

            ocorrencias_ml: resultadoML.ocorrencias,

            motor_de_regras: resultadoSeguranca
        });

    } catch (erro) {
        console.error("Erro na análise de segurança:", erro);

        return res.status(502).json({
            mensagem: "Não foi possível concluir a análise de segurança.",
            erro: erro instanceof Error
                ? erro.message
                : "Erro desconhecido"
        });
    }
}
