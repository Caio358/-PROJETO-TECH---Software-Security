# Documentação da API

## 1. Objetivo

Definir inicialmente os padrões de comunicação entre os módulos do Sistema Integrado de Segurança.

## 2. Padrão de Comunicação

A comunicação entre os componentes será realizada por meio de APIs REST, utilizando o protocolo HTTP e dados no formato JSON.

## 3. Módulos de Comunicação

- **Frontend → Backend:** envio de solicitações e consulta de informações.
- **Backend → Machine Learning:** envio de dados para análise e classificação de situações de risco.
- **Backend → Chatbot:** integração para consulta de informações e interação com usuários.
- **Backend → Banco de Dados:** armazenamento e recuperação de informações.

## 4. Endpoints Previstos

Os endpoints abaixo são propostas iniciais e poderão ser ajustados durante o desenvolvimento.

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/eventos` | Consultar ocorrências registradas. |
| GET | `/eventos/{id}` | Consultar uma ocorrência específica. |
| POST | `/eventos` | Registrar uma nova ocorrência. |
| GET | `/sensores` | Consultar sensores cadastrados. |
| POST | `/ml/analisar` | Solicitar análise de dados pelo serviço de Machine Learning. |
| POST | `/chatbot/mensagem` | Enviar mensagem ao Chatbot. |

## 5. Formato de Dados

As informações serão transmitidas preferencialmente em JSON.

Exemplo de ocorrência:

```json
{
  "id": "EVT-0001",
  "tipo": "INCENDIO",
  "origem": "SENSOR_FUMACA_01",
  "local": "Sala 02",
  "nivel_risco": "ALTO",
  "confianca": 0.95,
  "status
