# Shared — Componentes Compartilhados

## 1. Visão Geral

O diretório `shared/` reúne definições, estruturas e padrões utilizados por diferentes módulos do Sistema Integrado de Segurança Inteligente.

Seu objetivo é manter a comunicação entre os componentes consistente, reduzir duplicações e facilitar a integração entre as equipes de desenvolvimento.

## 2. Responsabilidades

O módulo poderá concentrar:

- Estruturas de dados compartilhadas.
- Modelos de requisição e resposta.
- Contratos de comunicação entre serviços.
- Constantes utilizadas por diferentes componentes.
- Padronização de identificadores e categorias de eventos.
- Definições comuns relacionadas aos alertas de segurança.

## 3. Integração entre os Componentes

As definições compartilhadas deverão respeitar as necessidades de cada módulo:

| Componente | Utilização |
|---|---|
| Front-End | Estruturas de dados recebidas da API e informações de eventos |
| Back-End | Contratos de comunicação e padronização de dados |
| Chatbot | Estruturas de mensagens e informações de ocorrências |
| ML Service | Formatos de entrada e saída das análises |

A utilização dessas definições deverá evitar divergências entre os componentes.

## 4
