# ML SERVICE — Serviço de Machine Learning

## 1. Visão geral

O ML Service é o serviço responsável por analisar as leituras dos sensores da residência e identificar comportamentos considerados anômalos.

Ele foi desenvolvido em Python utilizando FastAPI e Scikit-learn. O serviço acessa o banco de dados PostgreSQL, processa os dados registrados pelos sensores e armazena os resultados das análises.

O objetivo é complementar o sistema de segurança com uma camada de análise baseada em Machine Learning.

**Importante:** o modelo identifica padrões estatísticos incomuns. Suas classificações não representam, isoladamente, a confirmação de uma invasão, incêndio ou outra emergência.

## 2. Tecnologias utilizadas

- **Python:** linguagem utilizada no desenvolvimento do serviço.
- **FastAPI:** criação da API responsável por disponibilizar as análises.
- **Uvicorn:** servidor utilizado para executar a aplicação.
- **Pandas:** organização e manipulação dos dados.
- **NumPy:** operações numéricas.
- **Scikit-learn:** implementação do algoritmo de Machine Learning.
- **Psycopg:** conexão com o PostgreSQL.
- **Python-dotenv:** carregamento das variáveis de ambiente.

## 3. Arquitetura e integração

O serviço Python funciona separadamente do backend Node.js.

O fluxo de comunicação é:

1. O backend Node.js recebe uma solicitação de análise.
2. O Node.js realiza uma requisição HTTP para o ML Service.
3. O serviço Python consulta as leituras armazenadas no PostgreSQL.
4. O modelo processa os dados e identifica possíveis anomalias.
5. Os resultados são armazenados na tabela `analises_ml`.
6. O serviço Python devolve os resultados ao backend Node.js.
7. O backend executa seu motor de regras de segurança e retorna o resultado da operação.

O Machine Learning e o motor de regras possuem responsabilidades diferentes: o primeiro identifica anomalias estatísticas; o segundo verifica condições específicas para gerar ocorrências.

## 4. Modelo de Machine Learning

O projeto utiliza o algoritmo **Isolation Forest**, disponível na biblioteca Scikit-learn.

Esse algoritmo é utilizado para identificar observações que apresentam características diferentes do comportamento predominante dos dados.

### Configuração do modelo

- **Versão:** IsolationForest-v3.
- **Algoritmo:** Isolation Forest.
- **Contamination:** 0.05.
- **Random state:** 42.
- **Treinamento e avaliação:** divisão cronológica dos dados, utilizando os primeiros 80% para treinamento e os últimos 20% para avaliação.

O parâmetro `contamination` representa uma estimativa da proporção de anomalias utilizada na configuração do modelo. Ele não representa a probabilidade de uma ocorrência real.

### Variáveis analisadas

O modelo utiliza três características:

- Valor bruto da leitura do sensor.
- Diferença entre leituras consecutivas.
- Média móvel com janela de cinco leituras.

Atualmente, a análise é direcionada aos dados de temperatura e fumaça.

### Requisitos mínimos

Para que um sensor seja considerado na análise, são necessárias:

- Pelo menos 25 leituras registradas.
- Pelo menos dois valores distintos.

Sensores que não atendem a esses requisitos não são considerados naquela análise.

### Pontuação de anomalia

O modelo retorna uma pontuação normalizada entre 0 e 1 para representar o nível de anomalia atribuído à leitura.

Essa pontuação **não é uma probabilidade** de ocorrência de um evento real.

## 5. Armazenamento dos resultados

As análises são registradas na tabela `analises_ml`, que armazena informações sobre as leituras analisadas, suas classificações e a versão do modelo utilizado.

As características utilizadas na análise são armazenadas no campo `caracteristicas`, do tipo JSONB, permitindo registrar informações estruturadas relacionadas às leituras processadas.

O serviço também possui uma verificação para evitar que a mesma análise seja persistida repetidamente para as mesmas leituras e versão do modelo.

## 6. Endpoint disponível

### POST /analisar

Executa o processo de análise das leituras registradas no banco de dados.

**URL local:**

```text
http://127.0.0.1:8000/analisar
```

**Método:** POST

**Corpo da requisição:** não exige parâmetros no corpo.

**Funcionamento:**

1. Consulta as leituras disponíveis.
2. Organiza os dados por sensor.
3. Verifica os requisitos mínimos para análise.
4. Executa o modelo Isolation Forest.
5. Identifica e classifica possíveis anomalias.
6. Armazena os resultados no banco de dados.
7. Retorna um resumo da análise.

A documentação interativa do serviço está disponível em:

```text
http://127.0.0.1:8000/docs
```

## 7. Configuração do ambiente

O serviço Python possui um arquivo `.env` próprio dentro da pasta `ml-service`.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA
DB_NAME="Software Security"
```

As credenciais devem corresponder às configurações do PostgreSQL utilizado pelo projeto.

Não compartilhe nem envie o arquivo `.env` para o GitHub.

## 8. Instalação e execução

No terminal, acesse a pasta do serviço:

```powershell
cd ml-service
```

Crie o ambiente virtual:

```powershell
python -m venv .venv
```

Ative o ambiente virtual:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```powershell
pip install -r requirements.txt
```

Execute o serviço:

```powershell
python -m uvicorn main:app --reload --port 8000
```

Após a inicialização, a API estará disponível em:

```text
http://127.0.0.1:8000
```

## 9. Integração com o backend Node.js

O backend utiliza a variável de ambiente `ML_API_URL` para localizar o serviço Python.

Exemplo no `.env` do backend:

```env
ML_API_URL=http://localhost:8000
```

O endpoint do backend responsável por iniciar o fluxo completo de análise é:

`POST /ml/analisar`

Esse endpoint solicita a análise ao serviço Python e, após receber os resultados, executa o motor de regras de segurança do sistema.

Dessa forma, o backend combina os resultados estatísticos do Machine Learning com as condições definidas nas regras de segurança.

## 10. Limitações atuais

O serviço foi desenvolvido para fins acadêmicos e experimentais.

Limitações conhecidas:

- A análise depende da quantidade e da qualidade das leituras disponíveis.
- O modelo utiliza uma divisão cronológica dos dados, não um processamento contínuo em tempo real.
- Novas leituras podem não participar imediatamente da análise, dependendo de sua posição no conjunto de dados.
- A análise utiliza os dados disponíveis no momento da execução e não funciona como um detector contínuo de eventos.
- Uma anomalia estatística não significa necessariamente uma ameaça real.
- O modelo não substitui sistemas profissionais e certificados de detecção de incêndio ou segurança residencial.

## 11. Considerações finais

O ML Service complementa a arquitetura do Software Security ao permitir a identificação de padrões incomuns nas leituras dos sensores.

Sua integração com o backend Node.js possibilita combinar análise estatística e regras de segurança em um único fluxo de processamento.