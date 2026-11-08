
import { Request, Response } from "express";
import { obterContextoResidencia } from "../services/chatService";
import { gerarRespostaChat } from "../services/openaiService";

export async function consultarContexto(req: Request, res: Response) {
    try {
        const contexto = await obterContextoResidencia();

        return res.status(200).json({
            mensagem: "Contexto da residência consultado com sucesso.",
            contexto
        });

    } catch (erro) {
        console.error("Erro ao consultar contexto:", erro);

        return res.status(500).json({
            mensagem: "Erro ao consultar os dados da residência."
        });
    }
}


export async function enviarMensagem(req: Request, res: Response) {
    try {
        const { pergunta } = req.body;

        if (
            typeof pergunta !== "string" ||
            pergunta.trim().length === 0
        ) {
            return res.status(400).json({
                mensagem: "Informe uma pergunta válida."
            });
        }

        if (pergunta.length > 2000) {
            return res.status(400).json({
                mensagem: "A pergunta deve ter no máximo 2000 caracteres."
            });
        }

        // Buscar informações atualizadas da residência.
        const contexto = await obterContextoResidencia();

        // Enviar pergunta e contexto para a IA.
        const resposta = await gerarRespostaChat(
            pergunta.trim(),
            contexto
        );

        return res.status(200).json({
            mensagem: "Resposta gerada com sucesso.",
            resposta
        });

    } catch (erro) {
        console.error("Erro no chatbot:", erro);

        const mensagem = erro instanceof Error
            ? erro.message
            : "Erro desconhecido.";

        if (mensagem.includes("Chave da API OpenAI não configurada")) {
            return res.status(503).json({
                mensagem: "O assistente de IA ainda não está configurado."
            });
        }

        return res.status(502).json({
            mensagem: "Não foi possível obter uma resposta da IA."
        });
    }
}
