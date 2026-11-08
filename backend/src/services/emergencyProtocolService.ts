
import { randomUUID } from "crypto";
import * as protocolRepository from "../repositories/emergencyProtocolRepository";

const servicosPermitidos = [
    "POLICIA",
    "BOMBEIROS"
];

const statusPermitidos = [
    "CRIADO",
    "ACIONADO",
    "CONCLUIDO",
    "CANCELADO"
];

export async function buscarTodosProtocolos() {
    return await protocolRepository.listarTodos();
}

export async function cadastrarProtocolo(dados: {
    ocorrencia_id: number;
    servico: string;
}) {
    if (
        !Number.isInteger(dados.ocorrencia_id) ||
        dados.ocorrencia_id <= 0
    ) {
        throw new Error("ID da ocorrência inválido.");
    }

    if (!servicosPermitidos.includes(dados.servico)) {
        throw new Error(
            "Serviço inválido. Utilize POLICIA ou BOMBEIROS."
        );
    }

    const codigoProtocolo =
        `SIM-${randomUUID().slice(0, 8).toUpperCase()}`;

    return await protocolRepository.cadastrar({
        ocorrencia_id: dados.ocorrencia_id,
        servico: dados.servico,
        codigo_protocolo: codigoProtocolo
    });
}

export async function atualizarStatusProtocolo(
    id: number,
    status: string
) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("ID do protocolo inválido.");
    }

    if (!statusPermitidos.includes(status)) {
        throw new Error(
            "Status inválido. Utilize CRIADO, ACIONADO, CONCLUIDO ou CANCELADO."
        );
    }

    return await protocolRepository.atualizarStatus(id, status);
}
