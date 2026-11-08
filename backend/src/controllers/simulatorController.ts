
import { Request, Response } from "express";
import * as simulatorService from "../services/simulatorService";

export async function iniciar(req: Request, res: Response) {
    try {
        const resultado = await simulatorService.iniciarSimulador();
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro ao iniciar simulador:", error);

        return res.status(500).json({
            mensagem: "Erro ao iniciar o simulador."
        });
    }
}

export function parar(req: Request, res: Response) {
    const resultado = simulatorService.pararSimulador();
    return res.status(200).json(resultado);
}

export function status(req: Request, res: Response) {
    const resultado = simulatorService.consultarStatusSimulador();
    return res.status(200).json(resultado);
}


export function selecionarCenario(req: Request, res: Response) {
    try {
        const { cenario } = req.body;

        if (typeof cenario !== "string") {
            return res.status(400).json({
                mensagem: "Informe um cenário válido."
            });
        }

        const resultado = simulatorService.selecionarCenario(cenario);

        return res.status(200).json(resultado);

    } catch (error) {
        return res.status(400).json({
            mensagem: error instanceof Error
                ? error.message
                : "Erro ao selecionar cenário."
        });
    }
}
