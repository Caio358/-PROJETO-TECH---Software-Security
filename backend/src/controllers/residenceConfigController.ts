import { Request, Response } from "express";
import * as residenceConfigService from "../services/residenceConfigService";

export async function consultarModoSeguranca(
    req: Request,
    res: Response
) {
    try {
        const configuracao =
            await residenceConfigService.consultarModoSeguranca();

        return res.status(200).json({
            mensagem: "Configuração consultada com sucesso.",
            configuracao
        });

    } catch (error) {
        console.error("Erro ao consultar modo de segurança:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao consultar o modo de segurança."
        });
    }
}

export async function alterarModoSeguranca(
    req: Request,
    res: Response
) {
    try {
        const { modo } = req.body;

        if (typeof modo !== "string" || !modo.trim()) {
            return res.status(400).json({
                mensagem: "Informe o modo de segurança."
            });
        }

        const modoNormalizado = modo.trim().toUpperCase();

        if (
            modoNormalizado !== "ARMADO" &&
            modoNormalizado !== "DESARMADO"
        ) {
            return res.status(400).json({
                mensagem: "Modo inválido. Utilize ARMADO ou DESARMADO."
            });
        }

        const configuracao =
            await residenceConfigService.alterarModoSeguranca(
                modoNormalizado
            );

        return res.status(200).json({
            mensagem: `Residência ${modoNormalizado.toLowerCase()} com sucesso.`,
            configuracao
        });

    } catch (error) {
        console.error("Erro ao alterar modo de segurança:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao alterar o modo de segurança."
        });
    }
}
