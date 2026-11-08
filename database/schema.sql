-- Software Security
-- ESTRUTURA INICIAL DO BANCO DE DADOS


-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'MORADOR',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_perfil
    CHECK (perfil IN ('ADMIN', 'MORADOR'))
);

-- 2. CONFIGURACAO DA RESIDENCIA
CREATE TABLE IF NOT EXISTS configuracao_residencia (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    modo_seguranca VARCHAR(10) NOT NULL DEFAULT 'DESARMADO'
        CHECK (modo_seguranca IN ('ARMADO', 'DESARMADO')),
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_por INTEGER REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL
);

INSERT INTO configuracao_residencia (id, modo_seguranca)
VALUES (1, 'DESARMADO')
ON CONFLICT (id) DO NOTHING;


-- 3. MORADORES
CREATE TABLE IF NOT EXISTS moradores (
    id_morador SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario_id INTEGER UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_morador_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id_usuario)
    ON DELETE SET NULL
);


-- 4. SENSORES
CREATE TABLE IF NOT EXISTS sensores (
    id_sensor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    ambiente VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tipo_sensor
    CHECK (
        tipo IN (
            'PRESENCA',
            'MOVIMENTO',
            'PORTA',
            'JANELA',
            'TEMPERATURA',
            'FUMACA'
        )
    ),

    CONSTRAINT chk_status_sensor
    CHECK (
        status IN ('ATIVO', 'INATIVO', 'MANUTENCAO')
    )
);


-- 5. LEITURAS
CREATE TABLE IF NOT EXISTS leituras (
    id_leitura SERIAL PRIMARY KEY,
    sensor_id INTEGER NOT NULL,
    valor NUMERIC(12,4) NOT NULL,
    unidade VARCHAR(20),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leitura_sensor
    FOREIGN KEY (sensor_id)
    REFERENCES sensores(id_sensor)
    ON DELETE RESTRICT
);


-- 6. OCORRENCIAS
CREATE TABLE IF NOT EXISTS ocorrencias (
    id_ocorrencia SERIAL PRIMARY KEY,
    sensor_id INTEGER,
    tipo VARCHAR(30) NOT NULL,
    descricao TEXT NOT NULL,
    gravidade VARCHAR(20) NOT NULL,
    origem VARCHAR(20) NOT NULL DEFAULT 'ML',
    confianca NUMERIC(5,4),
    status VARCHAR(25) NOT NULL DEFAULT 'ABERTA',
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ocorrencia_sensor
    FOREIGN KEY (sensor_id)
    REFERENCES sensores(id_sensor)
    ON DELETE SET NULL,

    CONSTRAINT chk_tipo_ocorrencia
    CHECK (
        tipo IN (
            'INVASAO',
            'INCENDIO',
            'ANOMALIA',
            'FALHA_SENSOR'
        )
    ),

    CONSTRAINT chk_gravidade
    CHECK (
        gravidade IN (
            'BAIXA',
            'MEDIA',
            'ALTA',
            'CRITICA'
        )
    ),

    CONSTRAINT chk_origem
    CHECK (
        origem IN ('ML', 'REGRA', 'MANUAL')
    ),

    CONSTRAINT chk_confianca
    CHECK (
        confianca IS NULL OR
        confianca BETWEEN 0 AND 1
    ),

    CONSTRAINT chk_status_ocorrencia
    CHECK (
        status IN (
            'ABERTA',
            'EM_ANALISE',
            'RESOLVIDA',
            'FALSO_POSITIVO'
        )
    )
);


-- 7. ANALISES DO MACHINE LEARNING
CREATE TABLE IF NOT EXISTS analises_ml (
    id_analise SERIAL PRIMARY KEY,
    ocorrencia_id INTEGER,
    classificacao VARCHAR(20) NOT NULL,
    pontuacao NUMERIC(8,6),
    modelo_versao VARCHAR(50),
    caracteristicas JSONB,
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analise_ocorrencia
    FOREIGN KEY (ocorrencia_id)
    REFERENCES ocorrencias(id_ocorrencia)
    ON DELETE SET NULL,

    CONSTRAINT chk_classificacao
    CHECK (
        classificacao IN ('NORMAL', 'ANOMALIA')
    ),

    CONSTRAINT chk_pontuacao
    CHECK (
        pontuacao IS NULL OR
        pontuacao BETWEEN 0 AND 1
    )
);


-- 8. ALERTAS
CREATE TABLE IF NOT EXISTS alertas (
    id_alerta SERIAL PRIMARY KEY,
    ocorrencia_id INTEGER NOT NULL,
    usuario_id INTEGER,
    mensagem TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerta_ocorrencia
    FOREIGN KEY (ocorrencia_id)
    REFERENCES ocorrencias(id_ocorrencia)
    ON DELETE CASCADE,

    CONSTRAINT fk_alerta_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id_usuario)
    ON DELETE SET NULL,

    CONSTRAINT chk_status_alerta
    CHECK (
        status IN ('PENDENTE', 'ENVIADO', 'LIDO')
    )
);


-- 9. PROTOCOLOS DE EMERGENCIA
CREATE TABLE IF NOT EXISTS protocolos_emergencia (
    id_protocolo SERIAL PRIMARY KEY,
    ocorrencia_id INTEGER NOT NULL,
    servico VARCHAR(30) NOT NULL,
    codigo_protocolo VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'CRIADO',
    simulado BOOLEAN NOT NULL DEFAULT TRUE,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_protocolo_ocorrencia
    FOREIGN KEY (ocorrencia_id)
    REFERENCES ocorrencias(id_ocorrencia)
    ON DELETE CASCADE,

    CONSTRAINT chk_servico
    CHECK (
        servico IN ('BOMBEIROS', 'POLICIA')
    ),

    CONSTRAINT chk_status_protocolo
    CHECK (
        status IN (
            'CRIADO',
            'ACIONADO',
            'CONCLUIDO',
            'CANCELADO'
        )
    )
);



-- INDICES PARA MELHORAR AS CONSULTAS

CREATE INDEX IF NOT EXISTS idx_leituras_sensor_data
ON leituras(sensor_id, data_hora DESC);

CREATE INDEX IF NOT EXISTS idx_ocorrencias_data
ON ocorrencias(data_hora DESC);

CREATE INDEX IF NOT EXISTS idx_alertas_status
ON alertas(status);

CREATE INDEX IF NOT EXISTS idx_analises_data
ON analises_ml(data_analise DESC);