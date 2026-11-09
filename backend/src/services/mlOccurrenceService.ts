
import pool from "../config/database";
import * as mlRepository from "../repositories/mlRepository";
import * as occurrenceRepository from "../repositories/sensorOccurrenceRepository";

export async function registrarAnomaliasML() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const anomalias =
            await mlRepository.listarAnomaliasNaoVinculadas(client);

        if (anomalias.length === 0) {
            await client.query("COMMIT");

            return {
                total_processado: 0,
                ocorrencias_criadas: 0,
                ocorrencias_reutilizadas: 0
            };
        }

        const grupos = new Map<number, typeof anomalias>();

        for (const analise of anomalias) {
            const caracteristicas = analise.caracteristicas;
            const sensorId = Number(caracteristicas?.sensor_id);

            if (!Number.isInteger(sensorId) || sensorId <= 0) {
                continue;
            }

            if (!grupos.has(sensorId)) {
                grupos.set(sensorId, []);
            }

            grupos.get(sensorId)!.push(analise);
        }

        let ocorrenciasCriadas = 0;
        let ocorrenciasReutilizadas = 0;
        let totalProcessado = 0;

        for (const [sensorId, analises] of grupos) {
            const resultadoExistente = await client.query(
                `SELECT id_ocorrencia
                 FROM ocorrencias
                 WHERE sensor_id = $1
                   AND tipo = 'ANOMALIA'
                   AND origem = 'ML'
                   AND status IN ('ABERTA', 'EM_ANALISE')
                 ORDER BY data_hora DESC
                 LIMIT 1
                 FOR UPDATE`,
                [sensorId]
            );

            let idOcorrencia: number;

            if (resultadoExistente.rows.length > 0) {
                idOcorrencia =
                    resultadoExistente.rows[0].id_ocorrencia;

                ocorrenciasReutilizadas++;
            } else {
                const ocorrencia = await occurrenceRepository.cadastrar(
                    {
                        sensor_id: sensorId,
                        tipo: "ANOMALIA",
                        descricao:
                            `O sistema de Machine Learning identificou ` +
                            `${analises.length} leitura(s) anômala(s) ` +
                            `no sensor ${sensorId}.`,
                        gravidade: "BAIXA",
                        origem: "ML"
                    },
                    client
                );

                idOcorrencia = ocorrencia.id_ocorrencia;
                ocorrenciasCriadas++;
            }

            for (const analise of analises) {
                const vinculacao =
                    await mlRepository.vincularOcorrencia(
                        analise.id_analise,
                        idOcorrencia,
                        client
                    );

                if (vinculacao) {
                    totalProcessado++;
                }
            }
        }

        await client.query("COMMIT");

        return {
            total_processado: totalProcessado,
            ocorrencias_criadas: ocorrenciasCriadas,
            ocorrencias_reutilizadas: ocorrenciasReutilizadas
        };

    } catch (erro) {
        await client.query("ROLLBACK");
        throw erro;

    } finally {
        client.release();
    }
}
