Arquitetura do Sistema

1. Visão Geral

O Sistema Integrado de Segurança tem como objetivo monitorar ambientes, identificar situações de risco e emitir alertas relacionados a incêndios, invasões, vazamentos de gás e outras ocorrências.

2. Componentes do Sistema

Frontend: interface utilizada pelos usuários para acompanhar o monitoramento e visualizar alertas.

Backend: responsável pelas regras de negócio, comunicação entre os módulos e gerenciamento das informações.

Chatbot: responsável pela interação com os usuários e pelo fornecimento de informações sobre ocorrências.

Serviço de Machine Learning: desenvolvido em Python, será responsável por analisar dados e auxiliar na identificação e classificação de situações de risco.

Banco de Dados: responsável pelo armazenamento de usuários, dispositivos, eventos e histórico de ocorrências.

Shared: espaço destinado a estruturas e padrões compartilhados entre os módulos.

3. Comunicação entre os Componentes

O Frontend se comunica com o Backend por meio de uma API REST.

O Backend centraliza a comunicação com o banco de dados, o Chatbot e o serviço de Machine Learning.

O serviço de Machine Learning disponibiliza suas funcionalidades por meio de uma API REST desenvolvida em Python.

4. Fluxo Geral

O sistema recebe informações de sensores ou outras fontes de dados.

O Backend recebe e encaminha os dados para análise, quando necessário.

O serviço de Machine Learning analisa os dados e retorna sua classificação.

O Backend processa o resultado e registra a ocorrência.

O sistema disponibiliza as informações no Frontend e pode acionar o Chatbot.

O usuário visualiza o evento e recebe o alerta correspondente.

5. Observações

Esta arquitetura é uma proposta inicial e poderá ser modificada conforme a evolução do projeto e as decisões da equipe.
