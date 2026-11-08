
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

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

export async function executarAnaliseML(): Promise<ResultadoAnalise> {
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

    return await resposta.json() as ResultadoAnalise;
}
