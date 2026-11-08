import { PoolClient } from "pg";
import pool from "../config/database";
import * as occurrenceRepository from "../repositories/sensorOccurrenceRepository";
import * as alertRepository from "../repositories/alertRepository";

export async function buscarTodasOcorrencias() {
    return await occurrenceRepository.listarTodas();
}




export async function cadastrarOcorrencia(dados: {
    sensor_id: number | null;
    tipo: string;
    descricao: string;
    gravidade: string;
    origem: string;
}) {
    const tiposPermitidos = [
        "INVASAO",
        "INCENDIO",
        "ANOMALIA",
        "FALHA_SENSOR"
    ];

    const gravidadesPermitidas = [
        "BAIXA",
        "MEDIA",
        "ALTA",
        "CRITICA"
    ];

    const origensPermitidas = [
        "ML",
        "REGRA",
        "MANUAL"
    ];

    if (!tiposPermitidos.includes(dados.tipo)) {
        throw new Error("Tipo de ocorrência inválido.");
    }

    if (!gravidadesPermitidas.includes(dados.gravidade)) {
        throw new Error("Gravidade inválida.");
    }

    if (!origensPermitidas.includes(dados.origem)) {
        throw new Error("Origem inválida.");
    }

    if (!dados.descricao.trim()) {
        throw new Error("A descrição é obrigatória.");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Registra a ocorrência
        const ocorrencia = await occurrenceRepository.cadastrar(
            dados,
            client
        );


        // Cria alerta somente para gravidade ALTA ou CRITICA
        if (
            dados.gravidade === "ALTA" ||
            dados.gravidade === "CRITICA"
        ) {
            await alertRepository.cadastrar(
                {
                    ocorrencia_id: ocorrencia.id_ocorrencia,
                    mensagem: `ALERTA: ocorrência ${dados.tipo.toLowerCase()} registrada com gravidade ${dados.gravidade.toLowerCase()}. Verifique a situação.`
                },
                client
            );
        }

        await client.query("COMMIT");

        return ocorrencia;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}




export async function atualizarStatusOcorrencia(
    id: number,
    status: string
) {
    const statusPermitidos = [
        "ABERTA",
        "EM_ANALISE",
        "RESOLVIDA",
        "FALSO_POSITIVO"
    ];

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("ID da ocorrência inválido.");
    }

    if (!statusPermitidos.includes(status)) {
        throw new Error("Status da ocorrência inválido.");
    }

    return await occurrenceRepository.atualizarStatus(id, status);
}