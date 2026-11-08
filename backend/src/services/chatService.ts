
import pool from "../config/database";

const LIMITE_DESATUALIZACAO_SEGUNDOS = 30;

export async function obterContextoResidencia() {
    const conexao = await pool.connect();

    try {
        // 1. Buscar a leitura mais recente de cada sensor.
        const sensores = await conexao.query(`
            SELECT DISTINCT ON (s.id_sensor)
                s.id_sensor,
                s.nome,
                s.tipo,
                s.ambiente,
                s.status,
                l.valor,
                l.unidade,
                l.data_hora,

                CASE
                    WHEN l.data_hora IS NULL THEN NULL
                    ELSE EXTRACT(
                        EPOCH FROM (NOW() - l.data_hora)
                    )::INTEGER
                END AS idade_segundos,

                CASE
                    WHEN l.data_hora IS NULL THEN TRUE
                    WHEN l.data_hora < NOW() - INTERVAL '30 seconds'
                        THEN TRUE
                    ELSE FALSE
                END AS leitura_desatualizada

            FROM sensores s
            LEFT JOIN leituras l
                ON l.sensor_id = s.id_sensor

            ORDER BY
                s.id_sensor,
                l.data_hora DESC NULLS LAST
        `);

        // 2. Buscar ocorrências que ainda precisam de atenção.
        const ocorrencias = await conexao.query(`
            SELECT
                o.id_ocorrencia,
                o.tipo,
                o.descricao,
                o.gravidade,
                o.origem,
                o.status,
                o.data_hora,

                EXTRACT(
                    EPOCH FROM (NOW() - o.data_hora)
                )::INTEGER AS idade_segundos,

                s.nome AS sensor

            FROM ocorrencias o

            LEFT JOIN sensores s
                ON s.id_sensor = o.sensor_id

            WHERE o.status IN ('ABERTA', 'EM_ANALISE')

            ORDER BY o.data_hora DESC
            LIMIT 20
        `);

        // 3. Buscar alertas pendentes e sua idade.
        const alertas = await conexao.query(`
            SELECT
                a.id_alerta,
                a.ocorrencia_id,
                a.mensagem,
                a.status,
                a.data_hora,

                EXTRACT(
                    EPOCH FROM (NOW() - a.data_hora)
                )::INTEGER AS idade_segundos,

                o.tipo AS tipo_ocorrencia,
                o.gravidade

            FROM alertas a

            LEFT JOIN ocorrencias o
                ON o.id_ocorrencia = a.ocorrencia_id

            WHERE a.status = 'PENDENTE'

            ORDER BY a.data_hora DESC
            LIMIT 20
        `);

        // 4. Organizar os dados dos sensores.
        const sensoresFormatados = sensores.rows.map((sensor) => {
            const idadeSegundos =
                sensor.idade_segundos === null
                    ? null
                    : Number(sensor.idade_segundos);

            let estadoLeitura: string;

            if (sensor.data_hora === null) {
                estadoLeitura = "SEM_LEITURA";
            } else if (sensor.leitura_desatualizada) {
                estadoLeitura = "DESATUALIZADA";
            } else {
                estadoLeitura = "RECENTE";
            }

            return {
                ...sensor,
                valor: sensor.valor === null
                    ? null
                    : Number(sensor.valor),

                idade_segundos: idadeSegundos,
                estado_leitura: estadoLeitura
            };
        });

        // 5. Calcular os indicadores dos sensores.
        const totalSensores = sensoresFormatados.length;

        const totalSensoresAtivos = sensoresFormatados.filter(
            (sensor) => sensor.status === "ATIVO"
        ).length;

        const totalSensoresInativos = sensoresFormatados.filter(
            (sensor) => sensor.status === "INATIVO"
        ).length;

        const totalSensoresManutencao = sensoresFormatados.filter(
            (sensor) => sensor.status === "MANUTENCAO"
        ).length;

        const totalLeiturasRecentes = sensoresFormatados.filter(
            (sensor) => sensor.estado_leitura === "RECENTE"
        ).length;

        const totalLeiturasDesatualizadas = sensoresFormatados.filter(
            (sensor) => sensor.estado_leitura === "DESATUALIZADA"
        ).length;

        const totalSensoresSemLeitura = sensoresFormatados.filter(
            (sensor) => sensor.estado_leitura === "SEM_LEITURA"
        ).length;

        // 6. Calcular indicadores das ocorrências.
        const totalOcorrenciasCriticas = ocorrencias.rows.filter(
            (ocorrencia) => ocorrencia.gravidade === "CRITICA"
        ).length;

        // 7. Definir um resumo conservador da situação.
        let resumoSituacao: string;

        if (totalLeiturasDesatualizadas > 0 || totalSensoresSemLeitura > 0) {
            resumoSituacao = "MONITORAMENTO_LIMITADO";
        } else if (totalOcorrenciasCriticas > 0) {
            resumoSituacao = "OCORRENCIAS_CRITICAS_PENDENTES";
        } else if (ocorrencias.rows.length > 0) {
            resumoSituacao = "OCORRENCIAS_PENDENTES";
        } else {
            resumoSituacao = "SEM_OCORRENCIAS_PENDENTES";
        }

        // 8. Retornar o contexto completo.
        return {
            resumo_situacao: resumoSituacao,

            sensores: sensoresFormatados,

            indicadores_sensores: {
                total: totalSensores,
                ativos: totalSensoresAtivos,
                inativos: totalSensoresInativos,
                em_manutencao: totalSensoresManutencao,
                leituras_recentes: totalLeiturasRecentes,
                leituras_desatualizadas: totalLeiturasDesatualizadas,
                sem_leitura: totalSensoresSemLeitura
            },

            ocorrencias_abertas: ocorrencias.rows,

            indicadores_ocorrencias: {
                total_pendentes: ocorrencias.rows.length,
                total_criticas: totalOcorrenciasCriticas
            },

            alertas_pendentes: alertas.rows,

            total_alertas_pendentes: alertas.rows.length,

            limite_desatualizacao_segundos:
                LIMITE_DESATUALIZACAO_SEGUNDOS,

            consultado_em: new Date().toISOString()
        };

    } finally {
        conexao.release();
    }
}
