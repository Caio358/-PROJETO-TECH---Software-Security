# ML Service — Serviço de Machine Learning

## 1. Visão Geral

O ML Service será responsável pela análise de dados e pela classificação de possíveis situações de risco no Sistema Integrado de Segurança Inteligente.

O componente será desenvolvido em Python e disponibilizará suas funcionalidades por meio de uma API REST, permitindo que o Back-End encaminhe dados para análise e receba os resultados processados.

O objetivo é utilizar técnicas de Machine Learning para auxiliar na identificação de padrões e na classificação de eventos relacionados à segurança.

## 2. Objetivos do Serviço

- Receber dados encaminhados pelo Back-End.
- Processar e preparar os dados para análise.
- Aplicar modelos de Machine Learning.
- Identificar padrões associados a situações de risco.
- Classificar eventos conforme as categorias definidas.
- Retornar resultados ao Back-End.
- Permitir a evolução e avaliação dos modelos utilizados.

## 3. Responsabilidades do Módulo

As principais responsabilidades serão:

1. Receber dados por meio de uma API REST.
2. Validar a estrutura e a consistência das informações.
3. Realizar o pré-processamento dos dados.
4. Executar o modelo de Machine Learning.
5. Gerar uma classificação ou previsão.
6. Retornar o resultado em formato JSON.
7. Registrar informações técnicas necessárias para avaliação e manutenção.

## 4. Tipos de Eventos Previstos

O serviço poderá auxiliar na classificação de eventos como:

| Categoria | Descrição |
|---|---|
| INCENDIO | Possível ocorrência de incêndio. |
| INVASAO | Possível acesso não autorizado. |
| GAS | Possível vazamento de gás. |
| MOVIMENTO | Movimentação identificada no ambiente. |
| EMERGENCIA | Outras situações que necessitem de análise. |

As categorias definitivas dependerão dos dados disponíveis e da definição do escopo pela equipe.

## 5. Fluxo de Processamento

1. O Back-End recebe informações provenientes de sensores ou outras fontes.
2. O Back-End encaminha os dados ao ML Service.
3. O serviço valida e prepara os dados.
4. O modelo executa a análise.
5. O serviço gera uma classificação e, quando aplicável, uma pontuação de confiança.
6. O resultado é retornado ao Back-End.
7. O Back-End aplica as regras de negócio e decide como registrar e tratar a ocorrência.

## 6. API REST

O serviço deverá disponibilizar endpoints próprios para comunicação com o Back-End.

### Endpoint inicialmente previsto

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/ml/analisar` | Receber dados e executar a análise. |
| GET | `/ml/health` | Verificar a disponibilidade do serviço. |

### Exemplo de solicitação

```json
{
  "origem": "SENSOR_FUMACA_01",
  "local": "Sala 02",
  "dados": {
    "temperatura": 65.5,
    "fumaca": true
  }
}
```

Os campos apresentados são ilustrativos. A estrutura definitiva dependerá dos sensores, das fontes de dados e das variáveis utilizadas pelo modelo.

### Exemplo de resposta

```json
{
  "tipo": "INCENDIO",
  "nivel_risco": "ALTO",
  "confianca": 0.95
}
```

O valor de confiança representa uma estimativa do modelo e não uma garantia de que a classificação esteja correta.

## 7. Estrutura do Projeto

Estrutura sugerida:

```text
ml-service/
├── README.md
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   └── utils/
├── training/
│   ├── train.py
│   └── preprocessing.py
├── datasets/
├── tests/
├── requirements.txt
└── .env.example
```

### Responsabilidade dos Diretórios

- **app:** aplicação responsável pela disponibilização da API.
- **routes:** definição dos endpoints.
- **services:** execução das operações de análise.
- **models:** armazenamento e carregamento dos modelos treinados.
- **schemas:** validação das estruturas de entrada e saída.
- **utils:** funções auxiliares.
- **training:** scripts de treinamento e preparação dos modelos.
- **datasets:** organização dos conjuntos de dados utilizados, respeitando as restrições de licença e tamanho dos arquivos.
- **tests:** testes do serviço e dos modelos.

A estrutura poderá ser adaptada durante a implementação.

## 8. Tecnologias Previstas

| Tecnologia | Aplicação |
|---|---|
| Python | Linguagem de desenvolvimento. |
| FastAPI | Construção da API REST. |
| Scikit-learn | Treinamento e utilização de modelos tradicionais de Machine Learning, se adequado aos dados. |
| Pandas | Manipulação e organização de dados. |
| NumPy | Operações numéricas. |
| Joblib | Persistência de modelos treinados, quando aplicável. |
| Pytest | Testes automatizados. |

As bibliotecas definitivas deverão ser escolhidas conforme a abordagem de modelagem.

## 9. Dados e Treinamento

O desenvolvimento do modelo dependerá da disponibilidade de dados adequados.

Será necessário:

- Identificar as variáveis relevantes.
- Definir as categorias de classificação.
- Obter ou construir um conjunto de dados.
- Realizar limpeza e pré-processamento.
- Separar dados de treinamento e avaliação.
- Treinar o modelo.
- Avaliar seu desempenho.
- Registrar a versão do modelo utilizado.

As métricas de avaliação poderão incluir acurácia, precisão, recall, F1-score e matriz de confusão.

Em um sistema de segurança, o recall das classes de risco é especialmente importante, pois falsos negativos podem representar situações perigosas não identificadas.

## 10. Segurança e Confiabilidade

O serviço deverá considerar:

- Validação dos dados recebidos.
- Tratamento de exceções.
- Proteção de credenciais.
- Registro de erros.
- Controle de versões dos modelos.
- Monitoramento do desempenho.
- Tratamento de dados ausentes ou inválidos.

**Importante:** uma baixa pontuação de confiança do modelo não deverá, isoladamente, impedir a emissão de um alerta crítico. O Back-End deverá aplicar regras de segurança independentes da classificação automática.

## 11. Testes

Os testes deverão avaliar:

- Disponibilidade da API.
- Validação dos dados de entrada.
- Funcionamento do processamento.
- Carregamento do modelo.
- Consistência das respostas.
- Desempenho da classificação.
- Tratamento de entradas inválidas.
- Integração com o Back-End.

## 12. Responsabilidade

**Responsável:** a definir pela equipe.

O desenvolvimento do ML Service deverá possuir um responsável formalmente designado, mesmo que sua implementação seja realizada em colaboração com outro integrante.

## 13. Status do Módulo

**Situação atual:** planejamento e definição da arquitetura inicial.

Nenhum modelo de Machine Learning é considerado implementado até que seu treinamento, avaliação e integração sejam efetivamente realizados.

## 14. Referências Internas

- [Arquitetura do Sistema](../docs/arquitetura/README.md)
- [Requisitos do Sistema](../docs/requisitos/README.md)
- [Documentação da API](../docs/api/README.md)
