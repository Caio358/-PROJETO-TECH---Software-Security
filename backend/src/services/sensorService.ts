import * as sensorRepository from "../repositories/sensorRepository";

export async function buscarTodosSensores() {
    const sensores = await sensorRepository.listarTodos();

    return sensores;
}

export async function cadastrarSensor(dados: {
    nome: string;
    tipo: string;
    ambiente: string;
    status: string;
}) {
    if (!dados.nome || !dados.tipo || !dados.ambiente) {
        throw new Error("Preencha todos os campos obrigatórios.");
    }

    const tiposPermitidos = [
        "PRESENCA",
        "MOVIMENTO",
        "PORTA",
        "JANELA",
        "TEMPERATURA",
        "FUMACA"
    ];

    if (!tiposPermitidos.includes(dados.tipo)) {
        throw new Error("Tipo de sensor inválido.");
    }

    return await sensorRepository.cadastrar({
        ...dados,
        status: "ATIVO"
    });
}

export async function atualizarSensor(
    id: number,
    dados: {
        nome: string;
        tipo: string;
        ambiente: string;
        status: string;
    }
) {
    const tiposPermitidos = [
        "PRESENCA",
        "MOVIMENTO",
        "PORTA",
        "JANELA",
        "TEMPERATURA",
        "FUMACA"
    ];

    const statusPermitidos = [
        "ATIVO",
        "INATIVO",
        "MANUTENCAO"
    ];

    if (!dados.nome || !dados.ambiente) {
        throw new Error("Nome e ambiente são obrigatórios.");
    }

    if (!tiposPermitidos.includes(dados.tipo)) {
        throw new Error("Tipo de sensor inválido.");
    }

    if (!statusPermitidos.includes(dados.status)) {
        throw new Error("Status de sensor inválido.");
    }

    return await sensorRepository.atualizar(id, dados);
}

export async function excluirSensor(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("ID inválido.");
    }

    return await sensorRepository.excluir(id);
}