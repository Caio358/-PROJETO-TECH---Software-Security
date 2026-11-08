import { Request, Response } from "express";
import * as readingService from "../services/sensorReadingService";

export async function listarLeituras(req: Request, res: Response) {
    try {
        const leituras = await readingService.buscarTodasLeituras();

        return res.status(200).json({
            quantidade: leituras.length,
            leituras
        });

    } catch (error) {
        console.error("Erro ao consultar leituras:", error);

        return res.status(500).json({
            mensagem: "Erro ao consultar as leituras."
        });
    }
}

export async function cadastrarLeitura(req: Request, res: Response) {
    try {
        const { sensor_id, valor, unidade } = req.body;

        if (
            !Number.isInteger(sensor_id) ||
            typeof valor !== "number" ||
            typeof unidade !== "string" ||
            !unidade.trim()
        ) {
            return res.status(400).json({
                mensagem: "Informe sensor_id, valor e unidade corretamente."
            });
        }

        const leitura = await readingService.cadastrarLeitura({
            sensor_id,
            valor,
            unidade: unidade.trim()
        });

        return res.status(201).json({
            mensagem: "Leitura registrada com sucesso!",
            leitura
        });

    } catch (error) {
        console.error("Erro ao registrar leitura:", error);

        return res.status(500).json({
            mensagem: "Erro ao registrar leitura. Verifique se o sensor existe."
        });
    }
}