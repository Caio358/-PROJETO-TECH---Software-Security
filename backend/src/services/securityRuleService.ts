import pool from "../config/database";
import { randomUUID } from "crypto";
import * as protocolRepository from "../repositories/emergencyProtocolRepository";


interface LeituraRecente {
    id_sensor: number;
    nome: string;
    tipo: string;
    valor: number;
    data_hora: Date;
}

interface OcorrenciaCriada {
    id_ocorrencia: number;
    tipo: string;
}

export async function avaliarRegrasSeguranca() {
    const conexao = await pool.connect();

    try {
        const consulta = await conexao.query<LeituraRecente>(`
            SELECT DISTINCT ON (s.id_sensor)
                s.id_sensor,
                s.nome,
                s.tipo,
                l.valor,
                l.data_hora
            FROM sensores s
            INNER JOIN leituras l
                ON l.sensor_id = s.id_sensor
            WHERE s.status = 'ATIVO'
              AND l.data_hora >= NOW() - INTERVAL '60 seconds'
           ORDER BY s.id_sensor, l.data_hora DESC, l.id_leitura DESC
        `);

        const leituras = consulta.rows;

        const porta = leituras.find(
            leitura => leitura.tipo === "PORTA"
        );

       const movimentos = leituras.filter(
            leitura => leitura.tipo === "MOVIMENTO"
        );

        const fumaca = leituras.find(
            leitura => leitura.tipo === "FUMACA"
        );

        const temperatura = leituras.find(
            leitura => leitura.tipo === "TEMPERATURA"
        );

        const ocorrencias: OcorrenciaCriada[] = [];

await conexao.query("BEGIN");

const configuracao = await conexao.query<{
    modo_seguranca: string;
}>(`
    SELECT modo_seguranca
    FROM configuracao_residencia
    WHERE id = 1
`);

if (configuracao.rows.length === 0) {
    throw new Error("Configuração da residência não encontrada.");
}

const residenciaArmada =
    configuracao.rows[0].modo_seguranca === "ARMADO";

        // REGRA 1: possível acesso não autorizado.
        if (
            residenciaArmada &&
            porta &&
            Number(porta.valor) === 1 &&
            movimentos.some(movimento =>
            Number(movimento.valor) === 1 &&
            Math.abs(
            new Date(porta.data_hora).getTime() -
            new Date(movimento.data_hora).getTime()
            ) <= 10_000
             )
            ) {
             const criada = await registrarOcorrencia(
             conexao,
             porta.id_sensor,
             "INVASAO",
             "Abertura da porta e detecção de movimento em intervalo próximo. Evento requer verificação.",
             "ALTA",
             "ALERTA: possível acesso não autorizado. Verifique a porta principal e o ambiente."
             );

             if (criada) ocorrencias.push(criada);
        }

        // REGRA 2: possível risco de incêndio.
       // REGRA 2: possível risco de incêndio.
        if (
            fumaca &&
            temperatura &&
            Number(fumaca.valor) >= 0.15 &&
            Number(temperatura.valor) >= 27 &&
            Math.abs(
            new Date(fumaca.data_hora).getTime() -
            new Date(temperatura.data_hora).getTime()
            ) <= 10_000
            ) {
                const criada = await registrarOcorrencia(
                conexao,
                fumaca.id_sensor,
                "INCENDIO",
                "Leituras simultâneas de fumaça e temperatura acima dos limites experimentais configurados.",
                "CRITICA",
                "ALERTA: possível risco de incêndio. Verifique os sensores e a situação do ambiente."
            );

            if (criada) ocorrencias.push(criada);
            }

        await conexao.query("COMMIT");

        return {
            total_ocorrencias_criadas: ocorrencias.length,
            ocorrencias
        };

    } catch (erro) {
        await conexao.query("ROLLBACK");
        throw erro;

    } finally {
        conexao.release();
    }
}


async function registrarOcorrencia(
    conexao: import("pg").PoolClient,
    sensorId: number,
    tipo: string,
    descricao: string,
    gravidade: string,
    mensagem: string
): Promise<OcorrenciaCriada | null> {

    // Evita repetir a mesma ocorrência para o mesmo sensor
    // dentro de uma janela de cinco minutos.
    // Impede operações simultâneas para o mesmo sensor e tipo.
    await conexao.query(
        `SELECT pg_advisory_xact_lock($1::integer, hashtext($2))`,
        [sensorId, tipo]
    );

    const existente = await conexao.query(`
        SELECT id_ocorrencia
        FROM ocorrencias
        WHERE sensor_id = $1
          AND tipo = $2
          AND origem = 'REGRA'
          AND data_hora >= NOW() - INTERVAL '5 minutes'
        LIMIT 1
    `, [sensorId, tipo]);

    if (existente.rows.length > 0) {
        return null;
    }

    const resultado = await conexao.query(`
        INSERT INTO ocorrencias (
            sensor_id,
            tipo,
            descricao,
            gravidade,
            origem
        )
        VALUES ($1, $2, $3, $4, 'REGRA')
        RETURNING id_ocorrencia
    `, [sensorId, tipo, descricao, gravidade]);

    const idOcorrencia = resultado.rows[0].id_ocorrencia;

    await conexao.query(`
        INSERT INTO alertas (
            ocorrencia_id,
            mensagem
        )
        VALUES ($1, $2)
        `, [idOcorrencia, mensagem]);

    const servico = tipo === "INCENDIO"
         ? "BOMBEIROS"
         : "POLICIA";

    const codigoProtocolo =
        `SIM-${randomUUID().slice(0, 8).toUpperCase()}`;

    await protocolRepository.cadastrarNaTransacao(
        conexao,
        {
        ocorrencia_id: idOcorrencia,
        servico,
        codigo_protocolo: codigoProtocolo
         }
    );

    return {
        id_ocorrencia: idOcorrencia,
        tipo
    };
}
