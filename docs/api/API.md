# Documentação da API — Software Security

Este documento apresenta os endpoints disponíveis no backend do Software Security, seus métodos HTTP, parâmetros, exemplos de requisição e respostas.

## 1. Informações gerais

**Tecnologia:** Node.js + TypeScript + Express

**Endereço local:**

```text
http://localhost:3000
```

**Formato de comunicação:** JSON

**Documentação interativa Swagger:**

```text
http://localhost:3000/docs
```

As requisições que enviam dados devem utilizar o cabeçalho:

```http
Content-Type: application/json
```

## 2. Resumo dos endpoints

| Módulo | Método | Endpoint | Finalidade |
|---|---|---|---|
| Sistema | GET | `/` | Verificar disponibilidade da API |
| Sistema | GET | `/db-status` | Verificar conexão com o banco de dados |
| Chat | GET | `/chat/contexto` | Consultar contexto da residência |
| Chat | POST | `/chat/mensagem` | Enviar pergunta ao chatbot |
| Sensores | GET | `/sensores` | Listar sensores |
| Sensores | POST | `/sensores` | Cadastrar sensor |
| Sensores | PUT | `/sensores/{id}` | Atualizar sensor |
| Sensores | DELETE | `/sensores/{id}` | Excluir sensor |
| Leituras | GET | `/leituras` | Listar leituras |
| Leituras | POST | `/leituras` | Registrar leitura |
| Ocorrências | GET | `/ocorrencias` | Listar ocorrências |
| Ocorrências | POST | `/ocorrencias` | Registrar ocorrência |
| Ocorrências | PATCH | `/ocorrencias/{id}/status` | Atualizar status |
| Configuração | GET | `/configuracao-residencia` | Consultar modo de segurança |
| Configuração | PATCH | `/configuracao-residencia/modo-seguranca` | Alterar modo de segurança |
| Machine Learning | POST | `/ml/analisar` | Executar análise inteligente |
| Simulador | POST | `/simulador/iniciar` | Iniciar simulação |
| Simulador | POST | `/simulador/parar` | Parar simulação |
| Simulador | GET | `/simulador/status` | Consultar estado do simulador |
| Simulador | POST | `/simulador/cenario` | Selecionar cenário |
| Protocolos | GET | `/protocolos-emergencia` | Listar protocolos |
| Protocolos | POST | `/protocolos-emergencia` | Criar protocolo simulado |
| Protocolos | PATCH | `/protocolos-emergencia/{id}/status` | Atualizar status do protocolo |
| Alertas | GET | `/alertas` | Listar alertas |
| Alertas | POST | `/alertas` | Cadastrar alerta |
| Alertas | PATCH | `/alertas/{id}/status` | Atualizar status do alerta |

## 3. Chatbot

### GET /chat/contexto

Consulta o contexto atualizado da residência, incluindo sensores, leituras, ocorrências abertas e alertas pendentes.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "mensagem": "Contexto consultado com sucesso.",
  "contexto": {
    "resumo_situacao": "MONITORAMENTO_LIMITADO",
    "sensores": [],
    "indicadores_sensores": {
      "total": 0,
      "ativos": 0,
      "inativos": 0,
      "em_manutencao": 0,
      "leituras_recentes": 0,
      "leituras_desatualizadas": 0,
      "sem_leitura": 0
    },
    "ocorrencias_abertas": [],
    "indicadores_ocorrencias": {
      "total_pendentes": 0,
      "total_criticas": 0
    },
    "alertas_pendentes": [],
    "total_alertas_pendentes": 0,
    "limite_desatualizacao_segundos": 0,
    "consultado_em": "2026-11-08T01:42:19.197Z"
  }
}
```

**Resposta — 500 Internal Server Error:**

Erro ao consultar os dados da residência.

### POST /chat/mensagem

Envia uma pergunta ao chatbot. O serviço utiliza o contexto atual da residência para elaborar uma resposta por inteligência artificial.

**Corpo da requisição:**

```json
{
  "pergunta": "Existem ocorrências críticas na residência?"
}
```

A pergunta deve ser válida e possuir no máximo 2000 caracteres.

**Resposta — 200 OK:**

```json
{
  "mensagem": "Resposta gerada com sucesso.",
  "resposta": "Existem duas ocorrências críticas pendentes."
}
```

**Possíveis erros:**

| Código | Descrição |
|---|---|
| 400 | Pergunta inválida ou com mais de 2000 caracteres |
| 502 | Falha na comunicação ou resposta da IA |
| 503 | Assistente de IA não configurado |

## 4. Sensores

### GET /sensores

Retorna todos os sensores cadastrados.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "quantidade": 7,
  "sensores": [
    {
      "id_sensor": 1,
      "nome": "Sensor de Movimento Sala",
      "tipo": "MOVIMENTO",
      "ambiente": "Sala",
      "status": "ATIVO",
      "criado_em": "2026-11-08T01:42:19.207Z"
    }
  ]
}
```

### POST /sensores

Cadastra um novo sensor.

**Corpo da requisição:**

```json
{
  "nome": "Sensor de Movimento Sala",
  "tipo": "MOVIMENTO",
  "ambiente": "Sala"
}
```

Tipos aceitos:

- PRESENCA
- MOVIMENTO
- PORTA
- JANELA
- TEMPERATURA
- FUMACA

**Resposta — 201 Created:** sensor cadastrado com sucesso.

**Possíveis erros:**

- 400: dados incorretos ou tipo inválido.
- 500: erro interno ao cadastrar.

### PUT /sensores/{id}

Atualiza um sensor existente.

**Parâmetro de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| id | Integer | Identificador do sensor |

**Corpo da requisição:**

```json
{
  "nome": "Sensor de Movimento Sala",
  "tipo": "MOVIMENTO",
  "ambiente": "Sala",
  "status": "ATIVO"
}
```

**Resposta — 200 OK:** sensor atualizado com sucesso.

**Possíveis erros:**

- 400: ID ou dados inválidos.
- 404: sensor não encontrado.
- 500: erro interno.

### DELETE /sensores/{id}

Exclui um sensor.

**Parâmetro de rota:** `id`, identificador do sensor.

**Resposta — 200 OK:** sensor excluído com sucesso.

**Possíveis erros:**

- 404: sensor não encontrado.
- 500: erro interno.

## 5. Leituras

### GET /leituras

Lista todas as leituras registradas pelos sensores.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "quantidade": 10,
  "leituras": [
    {
      "id_leitura": 1,
      "sensor_id": 3,
      "sensor": "Sensor Porta Principal",
      "tipo": "PORTA",
      "ambiente": "Entrada",
      "valor": 1,
      "unidade": "estado",
      "data_hora": "2026-11-08T01:44:42.177Z"
    }
  ]
}
```

**Possível erro:**

- 500: erro ao consultar as leituras.

### POST /leituras

Registra uma nova leitura de sensor.

**Corpo da requisição:**

```json
{
  "sensor_id": 3,
  "valor": 1,
  "unidade": "estado"
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| sensor_id | Integer | Sim | Identificador do sensor |
| valor | Number | Sim | Valor registrado |
| unidade | String | Não | Unidade da leitura |

**Resposta — 201 Created:**

```json
{
  "mensagem": "Leitura registrada com sucesso!",
  "leitura": {
    "id_leitura": 10,
    "sensor_id": 3,
    "valor": 1,
    "unidade": "estado",
    "data_hora": "2026-11-08T01:44:42.166Z"
  }
}
```

**Possíveis erros:**

- 400: dados enviados em formato inválido.
- 500: erro ao registrar leitura ou sensor inexistente.

## 6. Ocorrências

### GET /ocorrencias

Lista todas as ocorrências registradas.

**Resposta — 200 OK:**

```json
{
  "quantidade": 5,
  "ocorrencias": [
    {
      "id_ocorrencia": 1,
      "sensor_id": 3,
      "sensor": "Sensor Porta Principal",
      "ambiente": "Entrada",
      "tipo": "INVASAO",
      "descricao": "Possível movimentação detectada na entrada.",
      "gravidade": "ALTA",
      "origem": "REGRA",
      "confianca": 0.92,
      "status": "ABERTA",
      "data_hora": "2026-11-08T01:42:19.214Z"
    }
  ]
}
```

### POST /ocorrencias

Registra uma nova ocorrência.

**Corpo da requisição:**

```json
{
  "sensor_id": 3,
  "tipo": "INVASAO",
  "descricao": "Possível movimentação detectada na entrada.",
  "gravidade": "ALTA",
  "origem": "MANUAL"
}
```

**Resposta — 201 Created:**

Retorna uma mensagem de sucesso e os dados da ocorrência cadastrada.

**Possíveis erros:**

- 400: dados inválidos.
- 500: erro ao registrar ocorrência.

**Observação:** ocorrências de gravidade ALTA ou CRITICA registradas pelo fluxo manual também podem gerar alertas automaticamente.

### PATCH /ocorrencias/{id}/status

Atualiza o status de uma ocorrência.

**Parâmetro de rota:** `id`, identificador da ocorrência.

**Corpo da requisição:**

```json
{
  "status": "EM_ANALISE"
}
```

Status disponíveis:

- ABERTA
- EM_ANALISE
- RESOLVIDA
- FALSO_POSITIVO

**Resposta — 200 OK:** status atualizado com sucesso.

**Possíveis erros:**

- 400: ID ou status inválido.
- 404: ocorrência não encontrada.
- 500: erro interno.

## 7. Configuração da residência

### GET /configuracao-residencia

Consulta a configuração atual de segurança da residência.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "mensagem": "Configuração consultada com sucesso.",
  "configuracao": {
    "id": 1,
    "modo_seguranca": "DESARMADO",
    "atualizado_em": "2026-11-07T23:45:34.611Z",
    "atualizado_por": null
  }
}
```

**Campos retornados:**

| Campo | Descrição |
|---|---|
| id | Identificador da configuração |
| modo_seguranca | Modo atual da residência |
| atualizado_em | Data e hora da última atualização |
| atualizado_por | Identificador do usuário responsável, quando disponível |

**Possível erro:**

- 500: erro interno ao consultar a configuração.

### PATCH /configuracao-residencia/modo-seguranca

Altera o modo de segurança da residência.

**Corpo da requisição:**

```json
{
  "modo": "ARMADO"
}
```

Modos disponíveis:

- ARMADO
- DESARMADO

**Resposta — 200 OK:** modo de segurança alterado com sucesso.

**Possíveis erros:**

- 400: modo informado inválido.
- 500: erro interno ao alterar o modo.

## 8. Machine Learning

### POST /ml/analisar

Executa a análise inteligente dos sensores.

O endpoint solicita a análise estatística ao serviço Python e, em seguida, executa o motor de regras de segurança do backend.

O motor de regras avalia possíveis situações de invasão e incêndio, podendo registrar ocorrências e alertas no banco de dados.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "mensagem": "Análise de segurança concluída.",
  "machine_learning": {
    "mensagem": "Análise concluída.",
    "total_analisado": 301,
    "total_anomalias": 17,
    "total_salvo": 10,
    "anomalias": [
      {
        "id_leitura": 25,
        "sensor_id": 3,
        "sensor": "Sensor Porta Principal",
        "tipo": "PORTA",
        "valor": 1,
        "classificacao": "ANOMALIA",
        "pontuacao": 0.87
      }
    ]
  },
  "motor_de_regras": {
    "total_ocorrencias_criadas": 1,
    "ocorrencias": [
      {
        "id_ocorrencia": 5,
        "tipo": "INCENDIO"
      }
    ]
  }
}
```

**Possível erro:**

- 502: falha na comunicação ou execução dos serviços de análise.

**Observação:** a pontuação do modelo é um indicador de anomalia, não uma probabilidade de ocorrência de um evento real.

**Geração automática de protocolos de emergência**

Quando o motor de regras identifica uma situação de invasão ou incêndio e registra uma ocorrência, o backend também cria automaticamente um alerta e um protocolo de emergência simulado.

O serviço associado depende do tipo de ocorrência:

| Tipo de ocorrência | Serviço associado |
|---|---|
| INCENDIO | BOMBEIROS |
| INVASAO | POLICIA |

Os protocolos são registrados com `simulado: true` e status inicial `CRIADO`.

A criação da ocorrência, do alerta e do protocolo ocorre dentro da mesma transação do banco de dados, garantindo a consistência desses registros.

**Importante:** essa integração é automática para ocorrências geradas pelo motor de regras. Os protocolos não representam acionamentos reais de serviços de emergência.

## 9. Simulador de sensores

O simulador gera leituras fictícias para todos os sensores ativos cadastrados no banco de dados. A primeira geração ocorre imediatamente após a inicialização, e as seguintes são realizadas em intervalos de 10 segundos.

O simulador possui quatro cenários, utilizados para representar diferentes comportamentos dos sensores durante os testes acadêmicos.

### POST /simulador/iniciar

Inicia a geração automática de leituras dos sensores ativos.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "ativo": true,
  "mensagem": "Simulador iniciado com sucesso."
}
```

**Possível erro:**

- 500: erro interno ao iniciar o simulador.

**Observação:** o endpoint foi testado e retornou HTTP 200. A geração automática de leituras foi confirmada.

### POST /simulador/parar

Interrompe a geração automática de leituras. Caso o simulador já esteja parado, informa essa condição.

**Parâmetros:** nenhum.

**Resposta — 200 OK (simulador interrompido):**

```json
{
  "ativo": false,
  "mensagem": "Simulador parado com sucesso."
}
```

**Resposta — 200 OK (simulador já parado):**

```json
{
  "ativo": false,
  "mensagem": "O simulador já está parado."
}
```

### GET /simulador/status

Consulta o estado atual do simulador.

**Parâmetros:** nenhum.

**Resposta — 200 OK:**

```json
{
  "ativo": false,
  "intervalo_segundos": 10,
  "cenario": "NORMAL",
  "etapa_cenario": 8
}
```

**Campos retornados:**

| Campo | Descrição |
|---|---|
| ativo | Indica se o simulador está em execução |
| intervalo_segundos | Intervalo entre as gerações de leituras |
| cenario | Cenário de simulação selecionado |
| etapa_cenario | Quantidade de ciclos registrados no cenário atual |

### POST /simulador/cenario

Seleciona o cenário utilizado na geração das leituras.

**Corpo da requisição:**

```json
{
  "cenario": "NORMAL"
}
```

**Cenários disponíveis:**

- NORMAL
- VARIACAO_INCOMUM
- TESTE_FUMACA
- TESTE_TEMPERATURA

Ao selecionar um cenário válido, os valores internos de temperatura e fumaça são reinicializados para seus valores de referência, e a etapa do cenário é zerada.

**Resposta — 200 OK:**

```json
{
  "cenario": "VARIACAO_INCOMUM",
  "mensagem": "Cenário VARIACAO_INCOMUM selecionado com sucesso."
}
```

**Possível erro:**

- 400: cenário inválido.

### Comportamento dos cenários

| Cenário | Comportamento |
|---|---|
| NORMAL | Gera pequenas variações nos valores de temperatura e fumaça |
| VARIACAO_INCOMUM | Produz aumento gradual nos valores de temperatura e fumaça |
| TESTE_FUMACA | Produz aumento gradual no nível de fumaça |
| TESTE_TEMPERATURA | Produz aumento gradual na temperatura |

**Observação:** os quatro cenários foram testados. As leituras geradas são dados sintéticos, destinados exclusivamente à simulação acadêmica. O simulador não utiliza sensores físicos nem aciona serviços de emergência reais.

## 10. Protocolos de emergência

Os protocolos são registros de simulação acadêmica. Nenhum contato real com polícia ou bombeiros é realizado.

### GET /protocolos-emergencia

Lista os protocolos registrados.

**Resposta — 200 OK:**

```json
[
  {
    "id_protocolo": 1,
    "ocorrencia_id": 3,
    "servico": "BOMBEIROS",
    "codigo_protocolo": "SIM-A1B2C3D4",
    "status": "CRIADO",
    "simulado": true,
    "data_hora": "2026-11-08T01:42:19.226Z",
    "tipo_ocorrencia": "INCENDIO",
    "descricao_ocorrencia": "Possível princípio de incêndio detectado."
  }
]
```

### POST /protocolos-emergencia

**Observação — Geração automática**

Além do cadastro manual pelo endpoint `POST /protocolos-emergencia`, os protocolos também são criados automaticamente pelo motor de regras durante a análise de segurança.

Para ocorrências do tipo `INCENDIO`, o serviço associado é `BOMBEIROS`. Para ocorrências do tipo `INVASAO`, o serviço associado é `POLICIA`.

O código do protocolo é gerado automaticamente e cada registro fica vinculado à ocorrência correspondente.

Cria um protocolo simulado.

**Corpo da requisição:**

```json
{
  "ocorrencia_id": 3,
  "servico": "BOMBEIROS"
}
```

Serviços disponíveis:

- BOMBEIROS
- POLICIA

O código do protocolo é gerado automaticamente.

**Resposta — 201 Created:**

Retorna a confirmação e os dados do protocolo criado.

**Possível erro:**

- 400: dados inválidos ou falha na criação.

### PATCH /protocolos-emergencia/{id}/status

**Corpo da requisição:**

```json
{
  "status": "ACIONADO"
}
```

**Status disponíveis:**

- CRIADO
- ACIONADO
- CONCLUIDO
- CANCELADO

**Resposta — 200 OK:**

```json
{
  "mensagem": "Status do protocolo atualizado com sucesso!",
  "protocolo": {
    "id_protocolo": 4,
    "ocorrencia_id": 7,
    "servico": "POLICIA",
    "codigo_protocolo": "SIM-5B0F3A4B",
    "status": "ACIONADO",
    "simulado": true,
    "data_hora": "2026-11-07T03:12:48.997Z"
  }
}
```

## 11. Alertas

### GET /alertas

Lista os alertas registrados.

**Resposta — 200 OK:**

```json
[
  {
    "id_alerta": 1,
    "ocorrencia_id": 3,
    "usuario_id": 1,
    "mensagem": "Alerta de possível invasão detectada.",
    "status": "PENDENTE",
    "data_hora": "2026-11-08T01:42:19.236Z",
    "tipo_ocorrencia": "INVASAO",
    "nome_usuario": "André"
  }
]
```

### POST /alertas

Cadastra um novo alerta.

**Corpo da requisição:**

```json
{
  "ocorrencia_id": 3,
  "usuario_id": 1,
  "mensagem": "Alerta de possível invasão detectada."
}
```

**Resposta — 201 Created:** retorna os dados do alerta cadastrado.

**Possível erro:**

- 400: dados inválidos ou falha no cadastro.

### PATCH /alertas/{id}/status

**Corpo da requisição:**

```json
{
  "status": "LIDO"
}
```

**Status disponíveis:**

- PENDENTE
- ENVIADO
- LIDO

**Resposta — 200 OK:**

```json
{
  "mensagem": "Status do alerta atualizado com sucesso!",
  "alerta": {
    "id_alerta": 15,
    "ocorrencia_id": 16,
    "usuario_id": null,
    "mensagem": "ALERTA: ocorrência invasao registrada com gravidade alta. Verifique a situação.",
    "status": "LIDO",
    "data_hora": "2026-11-08T00:48:23.362Z"
  }
}
```

## 12. Integração com o frontend

O frontend React + TypeScript deverá consumir os endpoints por meio de requisições HTTP.

**Exemplo de consulta de sensores:**

```javascript
const resposta = await fetch("http://localhost:3000/sensores");

const dados = await resposta.json();

console.log(dados.sensores);
```

**Exemplo de alteração do modo de segurança:**

```javascript
const resposta = await fetch(
  "http://localhost:3000/configuracao-residencia/modo-seguranca",
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      modo: "ARMADO"
    })
  }
);

const resultado = await resposta.json();

console.log(resultado);
```

## 13. Observações gerais

- Os endpoints apresentados correspondem à documentação disponibilizada pelo Swagger.
- Os parâmetros `{id}` representam identificadores enviados na URL.
- Os corpos das requisições que enviam dados utilizam JSON.
- Os códigos HTTP indicam o resultado da operação.
- Os serviços de emergência são exclusivamente simulados.
- A API não possui, nesta versão documentada, um fluxo completo de autenticação e autorização de usuários.