# Banco de Dados — Software Security

Este documento descreve a estrutura do banco de dados PostgreSQL utilizado pelo Software Security, incluindo suas tabelas, relacionamentos e procedimentos de configuração.

## 1. Tecnologia utilizada

O sistema utiliza PostgreSQL como sistema gerenciador de banco de dados relacional.

O banco armazena informações sobre usuários, moradores, sensores, leituras, ocorrências, análises de Machine Learning, alertas, protocolos de emergência e configurações da residência.

**Nome do banco de dados:** `Software Security`

**Porta padrão:** `5432`

## 2. Estrutura do banco de dados

O banco é composto por nove tabelas principais.

| Tabela | Responsabilidade |
|---|---|
| `usuarios` | Armazena os dados dos usuários do sistema. |
| `moradores` | Registra os moradores associados aos usuários. |
| `sensores` | Armazena os sensores cadastrados na residência. |
| `leituras` | Registra os valores coletados pelos sensores. |
| `ocorrencias` | Armazena situações identificadas pelo sistema. |
| `analises_ml` | Registra os resultados das análises de Machine Learning. |
| `alertas` | Armazena os alertas associados às ocorrências. |
| `protocolos_emergencia` | Registra protocolos simulados de emergência. |
| `configuracao_residencia` | Armazena o modo de segurança da residência. |

## 3. Descrição das tabelas

A restrição CHECK (id = 1) impede que sejam inseridos registros com identificadores diferentes de 1, mantendo a tabela limitada a uma configuração da residência.

### 3.1. usuarios

Armazena os dados de acesso e identificação dos usuários.

Principais campos:
- `id_usuario`: identificador único.
- `nome`: nome do usuário.
- `email`: endereço de e-mail, com restrição de unicidade.
- `senha_hash`: armazenamento do hash da senha.
- `perfil`: perfil do usuário, como ADMIN ou MORADOR.
- `criado_em`: data de criação do registro.

### 3.2. moradores

Armazena os moradores associados aos usuários cadastrados.

Principais campos:
- `id_morador`: identificador único.
- `nome`: nome do morador.
- `usuario_id`: referência ao usuário associado.
- `criado_em`: data de criação do registro.

O campo `usuario_id` possui uma restrição de unicidade, impedindo que um mesmo usuário seja associado a mais de um registro de morador. Caso o usuário seja excluído, a referência é definida como NULL.

### 3.3. sensores

Armazena os sensores utilizados no monitoramento residencial.

Principais campos:
- `id_sensor`: identificador único.
- `nome`: nome do sensor.
- `tipo`: categoria do sensor.
- `ambiente`: local onde está instalado.
- `status`: situação do sensor.
- `criado_em`: data de cadastro.

Tipos de sensores utilizados:
- PRESENCA
- MOVIMENTO
- PORTA
- JANELA
- TEMPERATURA
- FUMACA

Status possíveis:
- ATIVO
- INATIVO
- MANUTENCAO

### 3.4. leituras

Armazena os dados gerados pelos sensores.

Principais campos:
- `id_leitura`: identificador único.
- `sensor_id`: referência ao sensor responsável pela leitura.
- `valor`: valor registrado.
- `unidade`: unidade de medida.
- `data_hora`: momento do registro.

Cada leitura está associada a um sensor cadastrado.

### 3.5. ocorrencias

Registra situações identificadas pelas regras de segurança ou por outras operações do sistema.

Principais campos:
- `id_ocorrencia`: identificador único.
- `sensor_id`: sensor relacionado à ocorrência, quando aplicável.
- `tipo`: classificação da ocorrência.
- `descricao`: descrição da situação.
- `gravidade`: nível de gravidade.
- `origem`: origem do registro.
- `confianca`: valor de confiança, quando aplicável.
- `status`: situação atual da ocorrência.
- `data_hora`: momento do registro.

Tipos de ocorrência:
- INVASAO
- INCENDIO
- ANOMALIA
- FALHA_SENSOR

Níveis de gravidade:
- BAIXA
- MEDIA
- ALTA
- CRITICA

Origens:
- ML
- REGRA
- MANUAL

Status:
- ABERTA
- EM_ANALISE
- RESOLVIDA
- FALSO_POSITIVO

### 3.6. analises_ml

Armazena os resultados produzidos pelo serviço de Machine Learning.

Principais campos:

- `id_analise`: identificador único.
- `ocorrencia_id`: referência à ocorrência relacionada, quando aplicável.
- `classificacao`: classificação NORMAL ou ANOMALIA.
- `pontuacao`: pontuação produzida pela análise.
- `modelo_versao`: versão do modelo utilizado.
- `caracteristicas`: informações adicionais da análise armazenadas em JSONB, incluindo dados de identificação das leituras analisadas.
- `data_analise`: data e horário da análise.

A identificação das leituras é armazenada dentro de `caracteristicas`, não em uma coluna independente.


### 3.7. alertas

Armazena notificações relacionadas às ocorrências.

Principais campos:
- `id_alerta`: identificador único.
- `ocorrencia_id`: ocorrência relacionada.
- `usuario_id`: usuário associado ao alerta, quando aplicável.
- `mensagem`: conteúdo da notificação.
- `status`: situação do alerta.
- `data_hora`: momento de criação.

Status possíveis:
- PENDENTE
- ENVIADO
- LIDO

### 3.8. protocolos_emergencia

Registra protocolos simulados associados às ocorrências.

Principais campos:
- `id_protocolo`: identificador único.
- `ocorrencia_id`: ocorrência relacionada.
- `servico`: serviço associado ao protocolo.
- `codigo_protocolo`: código único de identificação.
- `status`: situação do protocolo.
- `simulado`: indica se o protocolo é simulado.
- `data_hora`: momento de criação.

Serviços possíveis:
- BOMBEIROS
- POLICIA

Status possíveis:
- CRIADO
- ACIONADO
- CONCLUIDO
- CANCELADO

Os protocolos são utilizados para fins de simulação e demonstração acadêmica.

### 3.9. configuracao_residencia

Armazena a configuração de segurança da residência.

Principais campos:
- `id`: identificador da configuração.
- `modo_seguranca`: modo atual de segurança.
- `atualizado_em`: data e horário da última atualização.
- `atualizado_por`: usuário responsável pela atualização, quando aplicável.

Modos disponíveis:
- ARMADO
- DESARMADO

A tabela utiliza um registro único de configuração, identificado pelo valor `1`.

O modo inicial é DESARMADO.

A restrição CHECK (id = 1) impede que sejam inseridos registros com identificadores diferentes de 1, mantendo a tabela limitada a uma configuração da residência.

## 4. Relacionamentos entre as tabelas

Os principais relacionamentos são:

| Tabela de origem | Campo de referência | Tabela relacionada |
|---|---|---|
| `moradores` | `usuario_id` | `usuarios` |
| `leituras` | `sensor_id` | `sensores` |
| `ocorrencias` | `sensor_id` | `sensores` |
| `analises_ml` | `ocorrencia_id` | `ocorrencias` |
| `alertas` | `ocorrencia_id` | `ocorrencias` |
| `alertas` | `usuario_id` | `usuarios` |
| `protocolos_emergencia` | `ocorrencia_id` | `ocorrencias` |
| `configuracao_residencia` | `atualizado_por` | `usuarios` |

As chaves estrangeiras garantem a integridade referencial entre os registros relacionados.

## 5. Índices

O banco utiliza índices para otimizar consultas frequentes.

| Índice | Finalidade |
|---|---|
| `idx_leituras_sensor_data` | Otimizar consultas de leituras por sensor e data. |
| `idx_ocorrencias_data` | Otimizar consultas de ocorrências por data. |
| `idx_alertas_status` | Facilitar consultas de alertas por status. |
| `idx_analises_data` | Otimizar consultas de análises por data. |

## 6. Configuração do banco de dados

Os arquivos responsáveis pela estrutura e pelos dados iniciais estão na pasta `database/`.

```text
database/
├── schema.sql
└── seed.sql
```

### schema.sql

Contém os comandos SQL responsáveis pela criação das tabelas, restrições, relacionamentos e índices.

### seed.sql

Contém os dados iniciais utilizados na configuração do sistema, incluindo os sensores necessários para o funcionamento do simulador.

O arquivo `seed.sql` cadastra sete sensores iniciais, distribuídos entre os ambientes Sala, Quarto, Entrada, Cozinha e Escritório.

Todos são inseridos inicialmente com status ATIVO.

O script utiliza uma verificação `WHERE NOT EXISTS` para evitar a duplicação de sensores que já possuam a mesma combinação de nome, tipo e ambiente.

## 7. Criando o banco de dados

No PostgreSQL, crie o banco:

```sql
CREATE DATABASE "Software Security";
```

Depois, conecte-se ao banco e execute os arquivos na seguinte ordem:

1. `database/schema.sql`
2. `database/seed.sql`

Os arquivos podem ser executados pelo pgAdmin ou pelo terminal PostgreSQL.

**Observação:** esses procedimentos são destinados à preparação de uma instalação nova. Em bancos já existentes, alterações estruturais devem ser realizadas por meio de migrações ou comandos específicos de atualização, evitando recriar ou sobrescrever dados.

## 8. Verificação das tabelas

Para verificar as tabelas existentes:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Para consultar os sensores cadastrados:

```sql
SELECT
    id_sensor,
    nome,
    tipo,
    ambiente,
    status
FROM sensores
ORDER BY id_sensor;
```

Para consultar as configurações de segurança:

```sql
SELECT *
FROM configuracao_residencia;
```

## 9. Integração com o backend

A conexão com o PostgreSQL é realizada pelo backend Node.js utilizando a biblioteca `pg`.

As configurações de conexão são definidas no arquivo `.env` da raiz do projeto.

O serviço Python também possui conexão própria com o banco, configurada pelo arquivo `.env` localizado em `ml-service/`.

Os dois serviços utilizam o mesmo banco de dados para acessar as informações necessárias às suas funcionalidades.