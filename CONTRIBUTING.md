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

A equipe poderá utilizar a seguinte organização:

- `main`: versão principal e estável do projeto.
- `develop`: integração das funcionalidades em desenvolvimento.
- `feature/`: desenvolvimento de novas funcionalidades.
- `fix/`: correção de problemas.

Exemplos:

```text
feature/login
feature/analise-ml
fix/validacao-eventos
docs/atualizacao-arquitetura
```

A adoção definitiva desse fluxo deverá ser alinhada entre os integrantes.

## 6. Pull Requests

Quando o trabalho utilizar branches, as alterações deverão ser integradas por meio de Pull Requests.

Cada Pull Request deverá:

- Apresentar um título objetivo.
- Descrever as alterações realizadas.
- Identificar o módulo afetado.
- Informar testes executados, quando aplicável.
- Evitar incluir alterações sem relação com a tarefa.

As alterações deverão ser revisadas antes de serem incorporadas à branch principal de integração.

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
