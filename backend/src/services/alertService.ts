
import * as alertRepository from "../repositories/alertRepository";

const statusPermitidos = [
    "PENDENTE",
    "ENVIADO",
    "LIDO"
];

export async function buscarTodosAlertas() {
    return await alertRepository.listarTodos();
}

export async function cadastrarAlerta(dados: {
    ocorrencia_id: number;
    usuario_id?: number | null;
    mensagem: string;
}) {
    if (
        !Number.isInteger(dados.ocorrencia_id) ||
        dados.ocorrencia_id <= 0
    ) {
        throw new Error("ID da ocorrência inválido.");
    }

    if (
        dados.usuario_id !== undefined &&
        dados.usuario_id !== null &&
        (!Number.isInteger(dados.usuario_id) || dados.usuario_id <= 0)
    ) {
        throw new Error("ID do usuário inválido.");
    }

    if (
        typeof dados.mensagem !== "string" ||
        dados.mensagem.trim() === ""
    ) {
        throw new Error("A mensagem do alerta é obrigatória.");
    }

    return await alertRepository.cadastrar({
        ...dados,
        mensagem: dados.mensagem.trim()
    });
}

export async function atualizarStatusAlerta(
    id: number,
    status: string
) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("ID do alerta inválido.");
    }

    if (!statusPermitidos.includes(status)) {
        throw new Error(
            "Status inválido. Use PENDENTE, ENVIADO ou LIDO."
        );
    }

    return await alertRepository.atualizarStatus(id, status);
}
