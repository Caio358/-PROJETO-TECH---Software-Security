# Sistema Integrado de Segurança Inteligente

<text> </text>

## 1. Sobre o Projeto

O **Sistema Integrado de Segurança Inteligente** é um projeto acadêmico desenvolvido com a finalidade de propor uma solução integrada para monitoramento de ambientes, identificação de situações de risco e emissão de alertas.

A proposta contempla a identificação de ocorrências como incêndios, invasões, vazamentos de gás, movimentações suspeitas e outras situações que possam representar riscos à segurança de pessoas e patrimônios.

O sistema prevê a integração de uma interface de monitoramento, uma API responsável pelo gerenciamento das operações, um Chatbot para interação com usuários e um serviço de Machine Learning desenvolvido em Python.

O objetivo é centralizar as informações recebidas, auxiliar na identificação de eventos e disponibilizar dados relevantes para tomada de decisão.

## 2. Objetivos do Projeto

### 2.1 Objetivo Geral

Desenvolver um sistema integrado capaz de receber, processar, classificar e apresentar informações relacionadas à segurança de ambientes, utilizando tecnologias de desenvolvimento de software e Machine Learning.

### 2.2 Objetivos Específicos

- Receber informações provenientes de sensores ou outras fontes de dados.
- Identificar e registrar possíveis situações de risco.
- Classificar ocorrências de acordo com seu tipo e nível de criticidade.
- Utilizar Machine Learning para auxiliar na análise e classificação de dados.
- Disponibilizar informações por meio de uma interface de monitoramento.
- Emitir alertas relacionados às ocorrências identificadas.
- Oferecer interação com usuários por meio de um Chatbot.
- Manter um histórico de eventos para consulta e acompanhamento.

## 3. Funcionalidades Previstas

| Funcionalidade | Descrição |
|---|---|
| Monitoramento | Recebimento e acompanhamento de informações do ambiente. |
| Identificação de eventos | Reconhecimento de possíveis situações de risco. |
| Classificação de risco | Organização dos eventos por tipo e criticidade. |
| Alertas | Comunicação de ocorrências identificadas. |
| Histórico | Consulta de eventos registrados. |
| Chatbot | Interação e consulta de informações pelo usuário. |
| Machine Learning | Análise de dados e auxílio na classificação de eventos. |

## 4. Arquitetura do Sistema

O projeto será desenvolvido de forma modular, permitindo que os componentes sejam implementados separadamente e integrados por meio de interfaces definidas.

### 4.1 Front-End

Responsável pela interface gráfica do sistema, permitindo que os usuários visualizem informações de monitoramento, ocorrências, alertas e históricos.

### 4.2 Back-End

Responsável pelas regras de negócio, processamento das solicitações, gerenciamento das informações e integração entre os componentes.

### 4.3 Chatbot

Responsável pela interação com os usuários, permitindo consultas e fornecimento de informações relacionadas ao sistema e às ocorrências registradas.

### 4.4 Serviço de Machine Learning

Componente desenvolvido em Python, responsável por analisar dados e auxiliar na identificação e classificação de situações de risco.

O serviço deverá disponibilizar suas funcionalidades por meio de uma API REST, permitindo a comunicação com o Back-End.

### 4.5 Banco de Dados

Responsável pelo armazenamento e gerenciamento de informações, incluindo usuários, dispositivos, ocorrências e histórico de eventos.

### 4.6 Integração

O Back-End será o ponto central de comunicação entre os módulos, evitando que cada componente precise implementar integrações independentes com todos os demais.

## 5. Tecnologias e Ferramentas

As tecnologias serão definidas e consolidadas conforme as decisões técnicas da equipe.

| Tecnologia/Ferramenta | Aplicação prevista |
|---|---|
| Python | Desenvolvimento do serviço de Machine Learning. |
| API REST | Comunicação entre os componentes. |
| Figma | Prototipação e planejamento visual da interface. |
| Git | Controle de versão do código. |
| GitHub | Hospedagem, documentação e colaboração. |
| Banco de Dados | Persistência das informações do sistema. |

As tecnologias definitivas do Front-End, Back-End e Banco de Dados ainda deverão ser confirmadas.

## 6. Estrutura do Repositório

```text
/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
│
├── frontend/
├── backend/
├── chatbot/
├── ml-service/
├── database/
├── shared/
├── tests/
│
├── docs/
│   ├── arquitetura/
│   ├── requisitos/
│   ├── api/
│   ├── diagramas/
│   └── atas/
│
├── README.md
├── CONTRIBUTING.md
├── .gitignore
└── .env.example
```

Cada diretório possui uma responsabilidade específica dentro da organização do projeto.

## 7. Documentação Técnica

A documentação do projeto está centralizada no diretório `docs/`.

- [Arquitetura do Sistema](docs/arquitetura/README.md)
- [Requisitos do Sistema](docs/requisitos/README.md)
- [Documentação da API](docs/api/README.md)
- [Diagramas do Sistema](docs/diagramas/README.md)
- [Atas de Reunião e Decisões](docs/atas/README.md)

## 8. Organização da Equipe

| Integrante | Responsabilidades |
|---|---|
| Lucas Aparecido Rolim Costa (149677) | Desenvolvimento Front-End e prototipação no Figma. |
| André Sousa Lima (155773) | Desenvolvimento Back-End e Chatbot. |
| Caio Veloso Lima Deodato (155849) | Gerenciamento do GitHub, documentação, versionamento, organização e integração. |

**Observação:** a responsabilidade pelo serviço de Machine Learning ainda precisa ser definida formalmente pela equipe.

## 9. Versionamento e Colaboração

O GitHub será utilizado como repositório central do projeto.

A organização do desenvolvimento deverá contemplar:

- Controle de versão por Git.
- Separação do trabalho por branches.
- Revisão de alterações por Pull Requests.
- Integração dos módulos.
- Registro das decisões e alterações relevantes.

As regras de contribuição serão documentadas em `CONTRIBUTING.md`.

## 10. Segurança e Boas Práticas

Durante o desenvolvimento, deverão ser observados os seguintes cuidados:

- Não armazenar senhas, tokens ou credenciais diretamente no código.
- Utilizar variáveis de ambiente para configurações sensíveis.
- Validar dados recebidos pelas APIs.
- Registrar ocorrências e operações relevantes.
- Controlar o acesso às funcionalidades conforme os perfis definidos.
- Evitar que uma classificação de Machine Learning seja tratada isoladamente como garantia de segurança.

## 11. Status do Projeto

**Situação atual:** planejamento, estruturação do repositório e elaboração da documentação inicial.

As funcionalidades descritas representam objetivos e propostas de desenvolvimento, não necessariamente recursos já implementados.

## 12. Finalidade Acadêmica

Este projeto possui finalidade acadêmica e será desenvolvido de forma colaborativa, com aplicação de conceitos de Engenharia de Software, desenvolvimento de APIs, integração de sistemas, documentação técnica, versionamento e Machine Learning.
