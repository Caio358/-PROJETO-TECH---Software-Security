
import OpenAI from "openai";
import { CHAT_SYSTEM_INSTRUCTIONS } from "./chatInstructions";

interface ContextoResidencia {
    [chave: string]: unknown;
}

export async function gerarRespostaChat(
    pergunta: string,
    contexto: ContextoResidencia
): Promise<string> {

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Chave da API OpenAI não configurada no backend."
        );
    }

    const openai = new OpenAI({
        apiKey
    });

    const modelo = process.env.OPENAI_MODEL || "gpt-5.5";

    try {
        const resposta = await openai.responses.create({
            model: modelo,

            instructions: CHAT_SYSTEM_INSTRUCTIONS,

            input: `
DADOS DO SENTINEL HOME:

${JSON.stringify(contexto, null, 2)}

PERGUNTA DO USUÁRIO:

${pergunta}

Responda considerando exclusivamente os dados fornecidos
quando falar sobre o estado da residência.
`,

            store: false
        });

        const texto = resposta.output_text?.trim();

        if (!texto) {
            throw new Error(
                "A IA não retornou uma resposta textual."
            );
        }

        return texto;

    } catch (erro) {
        console.error("Erro na comunicação com a OpenAI:", erro);

        throw erro;
    }
}
