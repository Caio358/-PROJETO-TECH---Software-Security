
import { registrarAnomaliasML } from "./mlOccurrenceService";

const ML_API_URL =
    process.env.ML_API_URL || "http://localhost:8000";

// Compartilha a mesma execução entre chamadas simultâneas.
let analiseEmAndamento: Promise<ResultadoAnaliseCompleta> | null = null;

export interface AnomaliaML {
    id_leitura: number;
    sensor_id: number;
    sensor: string;
    tipo: string;
    valor: number;
    classificacao: "ANOMALIA";
    pontuacao: number;
}

export interface ResultadoAnalise {
    mensagem: string;
    total_analisado: number;
    total_anomalias: number;
    total_salvo: number;
    anomalias: AnomaliaML[];
}

export interface ResultadoAnaliseCompleta {
    machine_learning: ResultadoAnalise;
    ocorrencias: {
        total_processado: number;
        ocorrencias_criadas: number;
        ocorrencias_reutilizadas: number;
    };
}

async function executarAnaliseInterna(): Promise<ResultadoAnaliseCompleta> {
    const resposta = await fetch(`${ML_API_URL}/analisar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(`Falha no serviço ML: ${erro}`);
    }

    const resultadoML =
        await resposta.json() as ResultadoAnalise;

    const resultadoOcorrencias =
        await registrarAnomaliasML();

    return {
        machine_learning: resultadoML,
        ocorrencias: resultadoOcorrencias
    };
}

export async function executarAnaliseML(): Promise<ResultadoAnaliseCompleta> {
    if (analiseEmAndamento) {
        console.log(
            "Análise ML já em andamento. Aguardando a execução atual."
        );

        return analiseEmAndamento;
    }

    analiseEmAndamento = executarAnaliseInterna();

    try {
        return await analiseEmAndamento;
    } finally {
        analiseEmAndamento = null;
    }
}
