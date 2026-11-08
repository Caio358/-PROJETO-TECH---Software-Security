
import * as sensorRepository from "../repositories/sensorRepository";
import * as readingRepository from "../repositories/sensorReadingRepository";

const INTERVALO_MS = 10_000;

export type CenarioSimulacao =
    | "NORMAL"
    | "VARIACAO_INCOMUM"
    | "TESTE_FUMACA"
    | "TESTE_TEMPERATURA";

let intervaloSimulador: ReturnType<typeof setInterval> | null = null;

let cenarioAtual: CenarioSimulacao = "NORMAL";

// Mantém os valores entre uma geração e outra.
let temperaturaAtual = 24.5;
let fumacaAtual = 0.08;

// Controla a progressão dos cenários.
let etapaCenario = 0;

function limitar(
    valor: number,
    minimo: number,
    maximo: number
): number {
    return Math.max(minimo, Math.min(maximo, valor));
}

function variar(
    valorAtual: number,
    variacao: number,
    minimo: number,
    maximo: number
): number {
    const novoValor = valorAtual + (Math.random() * variacao * 2 - variacao);

    return Number(limitar(novoValor, minimo, maximo).toFixed(2));
}

function gerarValor(tipo: string): {
    valor: number;
    unidade: string;
} {
    switch (tipo) {
        case "PRESENCA":
            return {
                valor: Math.random() < 0.5 ? 1 : 0,
                unidade: "estado"
            };

        case "MOVIMENTO":
            return {
                valor: Math.random() < 0.12 ? 1 : 0,
                unidade: "estado"
            };

        case "PORTA":
            return {
                valor: Math.random() < 0.05 ? 1 : 0,
                unidade: "estado"
            };

        case "JANELA":
            return {
                valor: Math.random() < 0.03 ? 1 : 0,
                unidade: "estado"
            };

        case "TEMPERATURA":
            return {
                valor: gerarTemperatura(),
                unidade: "°C"
            };

        case "FUMACA":
            return {
                valor: gerarFumaca(),
                unidade: "nivel"
            };

        default:
            return {
                valor: 0,
                unidade: "estado"
            };
    }
}

function gerarTemperatura(): number {
  switch (cenarioAtual) {
    case "NORMAL":
      temperaturaAtual = variar(temperaturaAtual, 0.2, 23, 26);
      break;

    case "VARIACAO_INCOMUM":
      temperaturaAtual = limitar(
        temperaturaAtual + 0.15,
        23,
        26.9
      );
      break;

    case "TESTE_FUMACA":
      temperaturaAtual = variar(temperaturaAtual, 0.1, 24, 25);
      break;

    case "TESTE_TEMPERATURA":
      temperaturaAtual = limitar(
        temperaturaAtual + 0.25,
        24,
        26.5
      );
      break;
  }

  return Number(temperaturaAtual.toFixed(2));
}

function gerarFumaca(): number {
  switch (cenarioAtual) {
    case "NORMAL":
      fumacaAtual = variar(fumacaAtual, 0.005, 0.06, 0.10);
      break;

    case "VARIACAO_INCOMUM":
      fumacaAtual = limitar(
        fumacaAtual + 0.003,
        0.06,
        0.149
      );
      break;

    case "TESTE_FUMACA":
      fumacaAtual = limitar(
        fumacaAtual + 0.005,
        0.08,
        0.14
      );
      break;

    case "TESTE_TEMPERATURA":
      fumacaAtual = variar(fumacaAtual, 0.005, 0.06, 0.10);
      break;
  }

  return Number(fumacaAtual.toFixed(3));
}

export async function gerarLeituras() {
    const sensores = await sensorRepository.listarAtivos();

    for (const sensor of sensores) {
        const leitura = gerarValor(sensor.tipo);

        await readingRepository.cadastrar({
            sensor_id: sensor.id_sensor,
            valor: leitura.valor,
            unidade: leitura.unidade
        });
    }

    etapaCenario++;

    console.log(
        `${sensores.length} sensores processados. ` +
        `Cenário: ${cenarioAtual}. Etapa: ${etapaCenario}.`
    );
}

export function selecionarCenario(cenario: string) {
    const cenariosPermitidos: CenarioSimulacao[] = [
        "NORMAL",
        "VARIACAO_INCOMUM",
        "TESTE_FUMACA",
        "TESTE_TEMPERATURA"
    ];

    if (!cenariosPermitidos.includes(cenario as CenarioSimulacao)) {
        throw new Error("Cenário de simulação inválido.");
    }

    cenarioAtual = cenario as CenarioSimulacao;
    etapaCenario = 0;

    temperaturaAtual = 24.5;
    fumacaAtual = 0.08;

    return {
        cenario: cenarioAtual,
        mensagem: `Cenário ${cenarioAtual} selecionado com sucesso.`
    };
}

export async function iniciarSimulador() {
    if (intervaloSimulador !== null) {
        return {
            ativo: true,
            mensagem: "O simulador já está em execução."
        };
    }

    intervaloSimulador = setInterval(() => {
        gerarLeituras().catch((erro) => {
            console.error("Erro na geração de leituras:", erro);
        });
    }, INTERVALO_MS);

    try {
        await gerarLeituras();
    } catch (erro) {
        clearInterval(intervaloSimulador);
        intervaloSimulador = null;
        throw erro;
    }

    return {
        ativo: true,
        mensagem: "Simulador iniciado com sucesso."
    };
}

export function pararSimulador() {
    if (intervaloSimulador === null) {
        return {
            ativo: false,
            mensagem: "O simulador já está parado."
        };
    }

    clearInterval(intervaloSimulador);
    intervaloSimulador = null;

    return {
        ativo: false,
        mensagem: "Simulador parado com sucesso."
    };
}

export function consultarStatusSimulador() {
    return {
        ativo: intervaloSimulador !== null,
        intervalo_segundos: INTERVALO_MS / 1000,
        cenario: cenarioAtual,
        etapa_cenario: etapaCenario
    };
}
