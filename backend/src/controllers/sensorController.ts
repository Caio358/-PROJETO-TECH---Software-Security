import { Request, Response } from "express";
import * as sensorService from "../services/sensorService";

export async function listarSensores(req: Request, res: Response) {
    try {
        const sensores = await sensorService.buscarTodosSensores();

        return res.status(200).json({
            quantidade: sensores.length,
            sensores: sensores
        });

    } catch (error) {
        console.error("Erro ao buscar sensores:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao consultar os sensores."
        });
    }
}

export async function cadastrarSensor(req: Request, res: Response) {
    try {
        const { nome, tipo, ambiente } = req.body;

        if (
            typeof nome !== "string" ||
            typeof tipo !== "string" ||
            typeof ambiente !== "string" ||
            !nome.trim() ||
            !tipo.trim() ||
            !ambiente.trim()
        ) {
            return res.status(400).json({
                mensagem: "Informe nome, tipo e ambiente corretamente."
            });
        }

        const novoSensor = await sensorService.cadastrarSensor({
            nome: nome.trim(),
            tipo: tipo.trim().toUpperCase(),
            ambiente: ambiente.trim(),
            status: "ATIVO"
        });

        return res.status(201).json({
            mensagem: "Sensor cadastrado com sucesso!",
            sensor: novoSensor
        });

    } catch (error) {
        if (error instanceof Error &&
            error.message === "Tipo de sensor inválido.") {
            return res.status(400).json({
                mensagem: error.message
            });
        }

        console.error("Erro ao cadastrar sensor:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao cadastrar sensor."
        });
    }
}

export async function atualizarSensor(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID inválido."
            });
        }

        const { nome, tipo, ambiente, status } = req.body;

        if (
            typeof nome !== "string" ||
            typeof tipo !== "string" ||
            typeof ambiente !== "string" ||
            typeof status !== "string" ||
            !nome.trim() ||
            !tipo.trim() ||
            !ambiente.trim() ||
            !status.trim()
        ) {
            return res.status(400).json({
                mensagem: "Informe todos os campos corretamente."
            });
        }

        const sensor = await sensorService.atualizarSensor(id, {
            nome: nome.trim(),
            tipo: tipo.trim().toUpperCase(),
            ambiente: ambiente.trim(),
            status: status.trim().toUpperCase()
        });

        if (!sensor) {
            return res.status(404).json({
                mensagem: "Sensor não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Sensor atualizado com sucesso!",
            sensor
        });

    } catch (error) {
        if (error instanceof Error &&
            (error.message.includes("inválido") ||
             error.message.includes("obrigatórios"))) {
            return res.status(400).json({
                mensagem: error.message
            });
        }

        console.error("Erro ao atualizar sensor:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao atualizar sensor."
        });
    }
}

export async function excluirSensor(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const sensor = await sensorService.excluirSensor(id);

        if (!sensor) {
            return res.status(404).json({
                mensagem: "Sensor não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Sensor excluído com sucesso!",
            sensor
        });

    } catch (error) {
        console.error("Erro ao excluir sensor:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao excluir sensor."
        });
    }
}