# Back-End — API e Regras de Negócio

## 1. Visão Geral

O módulo Back-End será responsável pelo processamento das operações do Sistema Integrado de Segurança Inteligente, centralizando as regras de negócio, o gerenciamento das informações e a comunicação entre os demais módulos.

Sua principal função será atuar como intermediário entre o Front-End, o Chatbot, o serviço de Machine Learning e o Banco de Dados.

## 2. Responsabilidades do Módulo

- Desenvolver e disponibilizar a API REST principal.
- Receber e validar solicitações do Front-End.
- Gerenciar o cadastro e a consulta de ocorrências.
- Processar informações recebidas de sensores e outras fontes.
- Integrar o serviço de Machine Learning.
- Integrar as funcionalidades do Chatbot.
- Gerenciar a comunicação com o Banco de Dados.
- Controlar o tratamento de erros.
- Disponibilizar informações para consulta e monitoramento.

## 3. Funcionalidades Previstas

### 3.1 Gerenciamento de Ocorrências

O Back-End deverá permitir:

- Registrar novas ocorrências.
- Consultar todas as ocorrências.
- Consultar uma ocorrência específica.
- Atualizar informações de uma ocorrência.
- Alterar o status de atendimento.
- Manter o histórico de registros.

### 3.2 Gerenciamento de Sensores

Caso o escopo final contemple sensores físicos ou simulados, o Back-End deverá permitir:

- Registrar dispositivos.
- Consultar dispositivos cadastrados.
- Identificar a origem dos dados recebidos.
- Associar informações dos dispositivos às ocorrências.

### 3.3 Processamento de Eventos

O Back-End será responsável por receber os dados, validar sua estrutura e encaminhá-los aos componentes necessários.

Quando aplicável, os dados serão enviados ao serviço de Machine Learning para análise e classificação.

### 3.4 Integração com o Chatbot

O Back-End deverá disponibilizar os recursos necessários para que o Chatbot consulte informações do sistema e responda às solicitações dos usuários.

### 3.5 Integração com Machine Learning

O Back-End deverá enviar os dados necessários ao serviço de Machine Learning e receber os resultados da análise.

A resposta deverá ser interpretada e utilizada conforme as regras de negócio estabelecidas.

A classificação gerada pelo modelo não deverá ser considerada uma garantia de segurança. Eventos críticos deverão possuir regras de tratamento que não dependam exclusivamente da confiança do modelo.

## 4. API REST

A comunicação com os demais componentes será realizada por meio de endpoints HTTP, utilizando JSON como formato padrão de troca de informações.

### Endpoints previstos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/eventos` | Listar ocorrências. |
| GET | `/eventos/{id}` | Consultar ocorrência específica. |
| POST | `/eventos` | Registrar ocorrência. |
| PUT | `/eventos/{id}` | Atualizar ocorrência. |
| GET | `/sensores` | Consultar sensores. |
| POST | `/ml/analisar` | Solicitar análise ao serviço de ML. |
| POST | `/chatbot/mensagem` | Encaminhar mensagem ao Chatbot. |

Os endpoints representam uma proposta inicial. Sua implementação e seus contratos deverão ser alinhados com a documentação em `docs/api/README.md`.

## 5. Arquitetura Interna

O Back-End deverá possuir uma organização que facilite manutenção, testes e evolução.

Estrutura sugerida:

```text id="1u0pxk"
backend/
├── README.md
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── integrations/
│   └── config/
├── tests/
├── requirements.txt
└── .env.example
```

### Responsabilidades das Camadas

- **Controllers:** recebem as requisições HTTP e organizam as respostas.
- **Services:** concentram as regras de negócio.
- **Repositories:** realizam operações de persistência e consulta.
- **Models:** representam as estruturas de dados.
- **Routes:** definem os caminhos e métodos da API.
- **Integrations:** organizam a comunicação com serviços externos e outros módulos.
- **Config:** concentra configurações da aplicação.

A estrutura definitiva dependerá da linguagem e do framework escolhidos.

## 6. Integração com o Banco de Dados

O Back-End será responsável por realizar as operações de leitura, inserção, atualização e exclusão de dados, conforme as regras definidas pelo sistema.

As informações previstas incluem:

- Usuários.
- Sensores e dispositivos.
- Ocorrências.
- Classificações de risco.
- Histórico de eventos.

## 7. Segurança e Validação

O desenvolvimento deverá considerar:

- Validação dos dados recebidos.
- Tratamento adequado de exceções.
- Proteção de credenciais por variáveis de ambiente.
- Controle de acesso às funcionalidades.
- Validação das permissões dos usuários.
- Registro de operações relevantes.
- Proteção contra solicitações inválidas.

## 8. Testes

O módulo
