import * as readingRepository from "../repositories/sensorReadingRepository";

export async function buscarTodasLeituras() {
    return await readingRepository.listarTodas();
}

export async function cadastrarLeitura(dados: {
    sensor_id: number;
    valor: number;
    unidade: string;
}) {
    if (!Number.isInteger(dados.sensor_id) || dados.sensor_id <= 0) {
        throw new Error("ID do sensor inválido.");
    }

    if (!Number.isFinite(dados.valor)) {
        throw new Error("Valor da leitura inválido.");
    }

    if (!dados.unidade.trim()) {
        throw new Error("Unidade de medida obrigatória.");
    }

    return await readingRepository.cadastrar(dados);
}