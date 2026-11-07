# Requisitos do Sistema

## 1. Objetivo

Definir os requisitos funcionais e não funcionais do Sistema Integrado de Segurança, destinado ao monitoramento de ambientes, identificação de situações de risco e emissão de alertas.

## 2. Requisitos Funcionais

| Código | Requisito |
|---|---|
| RF01 | O sistema deverá receber informações provenientes de sensores ou outras fontes de dados. |
| RF02 | O sistema deverá identificar e registrar ocorrências de risco. |
| RF03 | O sistema deverá classificar ocorrências por tipo e nível de risco. |
| RF04 | O sistema deverá disponibilizar os eventos registrados para consulta. |
| RF05 | O sistema deverá emitir alertas sobre ocorrências identificadas. |
| RF06 | O sistema deverá permitir a visualização do histórico de ocorrências. |
| RF07 | O sistema deverá disponibilizar um Chatbot para interação com os usuários. |
| RF08 | O sistema deverá utilizar um serviço de Machine Learning desenvolvido em Python para auxiliar na análise e classificação de dados. |

## 3. Requisitos Não Funcionais

| Código | Requisito |
|---|---|
| RNF01 | O sistema deverá possuir interface de fácil utilização. |
| RNF02 | A comunicação entre os módulos deverá ocorrer por interfaces definidas. |
| RNF03 | O serviço de Machine Learning deverá disponibilizar uma API REST. |
| RNF04 | O sistema deverá proteger informações e credenciais de acesso. |
| RNF05 | O sistema deverá manter registros das ocorrências para consulta posterior. |
| RNF06 | Os módulos deverão possuir organização que facilite manutenção e evolução. |

## 4. Tipos de Ocorrência Previstos

- Incêndio.
- Invasão.
- Vazamento de gás.
- Movimentação suspeita.
- Outras situações de emergência.

## 5. Observações

Os requisitos apresentados representam uma primeira versão da especificação do sistema. Eles deverão ser revisados e validados pela equipe e pelo professor antes da implementação.

Novos requisitos poderão ser adicionados conforme a definição das funcionalidades e das tecnologias utilizadas.
