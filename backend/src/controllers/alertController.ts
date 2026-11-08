
import { Request, Response } from "express";
import * as alertService from "../services/alertService";

export async function listarAlertas(req: Request, res: Response) {
    try {
        const alertas = await alertService.buscarTodosAlertas();
        return res.status(200).json(alertas);
    } catch (error) {
        console.error("Erro ao listar alertas:", error);
        return res.status(500).json({
            mensagem: "Erro interno ao listar alertas."
        });
    }
}

export async function cadastrarAlerta(req: Request, res: Response) {
    try {
        const alerta = await alertService.cadastrarAlerta(req.body);

        return res.status(201).json({
            mensagem: "Alerta cadastrado com sucesso!",
            alerta
        });
    } catch (error) {
        const mensagem = error instanceof Error
            ? error.message
            : "Erro ao cadastrar alerta.";

        return res.status(400).json({ mensagem });
    }
}

export async function atualizarStatusAlerta(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const alerta = await alertService.atualizarStatusAlerta(id, status);

        if (!alerta) {
            return res.status(404).json({
                mensagem: "Alerta não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Status do alerta atualizado com sucesso!",
            alerta
        });
    } catch (error) {
        const mensagem = error instanceof Error
            ? error.message
            : "Erro ao atualizar alerta.";

        return res.status(400).json({ mensagem });
    }
}
