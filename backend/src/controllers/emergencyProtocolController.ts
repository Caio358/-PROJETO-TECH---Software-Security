
import { Request, Response } from "express";
import * as protocolService from "../services/emergencyProtocolService";

export async function listarProtocolos(req: Request, res: Response) {
    try {
        const protocolos = await protocolService.buscarTodosProtocolos();

        return res.status(200).json(protocolos);
    } catch (error) {
        console.error("Erro ao listar protocolos:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao listar protocolos."
        });
    }
}

export async function cadastrarProtocolo(req: Request, res: Response) {
    try {
        const protocolo = await protocolService.cadastrarProtocolo(req.body);

        return res.status(201).json({
            mensagem: "Protocolo simulado criado com sucesso!",
            protocolo
        });
    } catch (error) {
        const mensagem = error instanceof Error
            ? error.message
            : "Erro ao criar protocolo.";

        return res.status(400).json({ mensagem });
    }
}

export async function atualizarStatusProtocolo(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const protocolo =
            await protocolService.atualizarStatusProtocolo(id, status);

        if (!protocolo) {
            return res.status(404).json({
                mensagem: "Protocolo não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Status do protocolo atualizado com sucesso!",
            protocolo
        });
    } catch (error) {
        const mensagem = error instanceof Error
            ? error.message
            : "Erro ao atualizar protocolo.";

        return res.status(400).json({ mensagem });
    }
}
