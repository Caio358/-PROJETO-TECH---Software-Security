# Guia de Contribuição

## 1. Objetivo

Este documento estabelece as orientações para contribuição, organização e manutenção do repositório do Sistema Integrado de Segurança Inteligente.

Todos os integrantes deverão seguir estas diretrizes para manter o desenvolvimento organizado, facilitar a integração dos módulos e preservar o histórico do projeto.

## 2. Organização do Projeto

O repositório está dividido em diretórios específicos para cada componente:

| Diretório | Finalidade |
|---|---|
| `frontend/` | Interface do usuário |
| `backend/` | API e regras de negócio |
| `chatbot/` | Comunicação e atendimento automatizado |
| `ml-service/` | Serviço de Machine Learning |
| `database/` | Estrutura e gerenciamento dos dados |
| `shared/` | Contratos e estruturas compartilhadas |
| `tests/` | Testes e validação |
| `docs/` | Documentação técnica |

Cada integrante deverá priorizar as alterações relacionadas ao seu módulo, respeitando as dependências e os contratos definidos pela equipe.

## 3. Padrão de Commits

As mensagens de commit deverão ser objetivas e indicar o tipo de alteração realizada.

Padrão recomendado:

```text
tipo: descrição da alteração
```

Tipos sugeridos:

| Tipo | Utilização |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de erro |
| `docs` | Alteração na documentação |
| `refactor` | Reorganização do código |
| `test` | Criação ou alteração de testes |
| `chore` | Manutenção e configuração |

Exemplos:

```text
docs: atualiza documentação da arquitetura
feat: adiciona endpoint de produtos
fix: corrige validação de eventos
test: adiciona testes da API
chore: atualiza dependências
```

## 4. Organização das Alterações

Antes de realizar alterações, o integrante deverá:

1. Identificar o módulo relacionado à tarefa.
2. Verificar a documentação existente.
3. Evitar modificar arquivos de outros módulos sem alinhamento com a equipe.
4. Manter os nomes de arquivos e diretórios consistentes.
5. Atualizar a documentação quando houver mudanças relevantes.

## 5. Branches e Versionamento

O projeto utilizará um fluxo de branches para organizar o desenvolvimento, facilitar a integração e proteger a versão estável do sistema.

As branches serão organizadas da seguinte forma:

| Branch | Finalidade |
|---|---|
| `main` | Versão estável e validada do projeto |
| `develop` | Integração das funcionalidades em desenvolvimento |
| `feature/` | Desenvolvimento de novas funcionalidades |
| `fix/` | Correção de problemas |
| `docs/` | Alterações exclusivamente na documentação |

### Fluxo de desenvolvimento

1. Cada integrante deverá criar uma branch específica a partir de `develop`.
2. As alterações deverão ser realizadas na branch correspondente à tarefa.
3. Após concluir o trabalho, o integrante deverá abrir um Pull Request direcionado à `develop`.
4. As alterações deverão ser revisadas e validadas antes da integração.
5. Quando `develop` estiver estável, poderá ser aberto um Pull Request direcionado à `main`.

Não deverão ser realizadas alterações diretamente na `main`.

Exemplos de branches:

``text
feature/login
feature/analise-ml
fix/validacao-eventos
docs/atualizacao-arquitetura

## 6. Pull Requests

A integração das alterações deverá ser realizada por meio de Pull Requests (PRs), respeitando o fluxo de branches definido neste documento.

### Integração com develop

Todo Pull Request de funcionalidades, correções ou documentação deverá:

- Ter como branch de origem a branch de trabalho do integrante.
- Ter como branch de destino a `develop`.
- Apresentar um título objetivo.
- Descrever as alterações realizadas.
- Identificar o módulo afetado.
- Informar a Issue relacionada, quando existir.
- Apresentar os testes executados, quando aplicável.
- Evitar alterações sem relação com a tarefa.

### Integração com main

Quando a branch `develop` estiver estável e validada, poderá ser aberto um Pull Request com destino à `main`.

Esse Pull Request deverá apresentar um resumo das alterações integradas e as validações realizadas.

### Revisão e aprovação

As alterações deverão ser analisadas antes da integração.

A revisão deverá considerar:

- Compatibilidade com a arquitetura do projeto.
- Ausência de conflitos.
- Funcionamento das funcionalidades afetadas.
- Atualização da documentação, quando necessária.
- Ausência de credenciais ou informações sensíveis.

A integração deverá respeitar as regras de proteção configuradas no GitHub.
## 7. Qualidade e Segurança

Todos os integrantes deverão observar as seguintes práticas:

- Não publicar senhas, tokens ou credenciais.
- Não enviar arquivos `.env` com informações reais.
- Evitar código duplicado e desnecessário.
- Documentar funcionalidades relevantes.
- Validar entradas recebidas pelo sistema.
- Tratar erros de maneira adequada.
- Preservar a integridade dos dados.
- Não remover funcionalidades de outros módulos sem alinhamento prévio.

## 8. Comunicação entre os Integrantes

Alterações que possam afetar a integração deverão ser comunicadas aos demais integrantes.

Isso inclui:

- Mudanças nos endpoints da API.
- Alterações nos formatos de requisição e resposta.
- Modificações no banco de dados.
- Mudanças nos contratos compartilhados.
- Alterações na comunicação com o serviço de Machine Learning.
- Modificações que afetem o funcionamento do Chatbot.

## 9. Responsabilidade pelo Repositório

A organização, documentação, versionamento e acompanhamento das alterações serão coordenados pelo integrante responsável pela gestão do GitHub.

As decisões técnicas deverão ser discutidas com os integrantes responsáveis pelos respectivos módulos.

## 10. Considerações Finais

O cumprimento destas orientações tem como finalidade manter o repositório organizado, facilitar o trabalho colaborativo e reduzir problemas durante a integração dos componentes.

Este documento poderá ser atualizado conforme a evolução do projeto e as decisões da equipe.
