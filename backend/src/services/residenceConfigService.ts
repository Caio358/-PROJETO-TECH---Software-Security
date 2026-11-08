import * as residenceConfigRepository from "../repositories/residenceConfigRepository";
import type { ModoSeguranca } from "../repositories/residenceConfigRepository";

export async function consultarModoSeguranca() {
    const configuracao =
        await residenceConfigRepository.consultarConfiguracao();

    if (!configuracao) {
        throw new Error("Configuração da residência não encontrada.");
    }

    return configuracao;
}

export async function alterarModoSeguranca(
    modo: ModoSeguranca,
    usuarioId: number | null = null
) {
    const modosPermitidos: ModoSeguranca[] = [
        "ARMADO",
        "DESARMADO"
    ];

    if (!modosPermitidos.includes(modo)) {
        throw new Error("Modo de segurança inválido.");
    }

    if (
        usuarioId !== null &&
        (!Number.isInteger(usuarioId) || usuarioId <= 0)
    ) {
        throw new Error("ID do usuário inválido.");
    }

    const configuracao =
        await residenceConfigRepository.atualizarModoSeguranca(
            modo,
            usuarioId
        );

    if (!configuracao) {
        throw new Error("Não foi possível atualizar o modo de segurança.");
    }

    return configuracao;
}
