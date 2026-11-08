import { Request, Response } from "express";
import * as occurrenceService from "../services/sensorOccurrenceService";

export async function listarOcorrencias(req: Request, res: Response) {
    try {
        const ocorrencias = await occurrenceService.buscarTodasOcorrencias();

        return res.status(200).json({
            quantidade: ocorrencias.length,
            ocorrencias
        });

    } catch (error) {
        console.error("Erro ao consultar ocorrências:", error);

        return res.status(500).json({
            mensagem: "Erro ao consultar ocorrências."
        });
    }
}

export async function cadastrarOcorrencia(req: Request, res: Response) {
    try {
        const {
            sensor_id,
            tipo,
            descricao,
            gravidade,
            origem
        } = req.body;

        const sensorValido =
            sensor_id === null ||
            (Number.isInteger(sensor_id) && sensor_id > 0);

        if (
            !sensorValido ||
            typeof tipo !== "string" ||
            typeof descricao !== "string" ||
            typeof gravidade !== "string" ||
            typeof origem !== "string" ||
            !descricao.trim()
        ) {
            return res.status(400).json({
                mensagem: "Dados da ocorrência inválidos."
            });
        }

        const ocorrencia = await occurrenceService.cadastrarOcorrencia({
            sensor_id,
            tipo: tipo.trim().toUpperCase(),
            descricao: descricao.trim(),
            gravidade: gravidade.trim().toUpperCase(),
            origem: origem.trim().toUpperCase()
        });

        return res.status(201).json({
            mensagem: "Ocorrência registrada com sucesso!",
            ocorrencia
        });

    } catch (error) {
        if (
            error instanceof Error &&
            ["Tipo de ocorrência inválido.", "Gravidade inválida.",
             "Origem inválida.", "A descrição é obrigatória."]
            .includes(error.message)
        ) {
            return res.status(400).json({
                mensagem: error.message
            });
        }

        console.error("Erro ao registrar ocorrência:", error);

        return res.status(500).json({
            mensagem: "Erro ao registrar ocorrência. Verifique os dados enviados."
        });
    }
}

export async function atualizarStatusOcorrencia(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (typeof status !== "string") {
            return res.status(400).json({
                mensagem: "Informe um status válido."
            });
        }

        const ocorrencia =
            await occurrenceService.atualizarStatusOcorrencia(
                id,
                status.trim().toUpperCase()
            );

        if (!ocorrencia) {
            return res.status(404).json({
                mensagem: "Ocorrência não encontrada."
            });
        }

        return res.status(200).json({
            mensagem: "Status atualizado com sucesso!",
            ocorrencia
        });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                mensagem: error.message
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao atualizar ocorrência."
        });
    }
}