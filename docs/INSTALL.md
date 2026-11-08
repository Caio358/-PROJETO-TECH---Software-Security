# Guia de Instalação — Software Security

Este documento apresenta os procedimentos necessários para configurar e executar o backend do Software Security em ambientes Windows 11 e Linux.

## 1. Pré-requisitos

Antes de iniciar, instale os seguintes programas:

| Tecnologia | Finalidade |
|---|---|
| Node.js (versão LTS) | Execução do backend |
| npm | Gerenciamento de dependências Node.js |
| Python 3 | Execução do serviço de Machine Learning |
| PostgreSQL | Banco de dados |
| Visual Studio Code | Editor de código recomendado |
| Git | Controle de versão (opcional) |

Verifique as instalações pelo terminal:

```bash
node -v
npm -v
python --version
```

No Linux, caso `python` não funcione, utilize:

```bash
python3 --version
```

## 2. Obtenção do projeto

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd Software-Security-backend
```

Caso o projeto já esteja disponível no computador, basta abrir sua pasta no terminal.

## 3. Configuração do banco de dados

Instale e inicie o PostgreSQL.

Crie um banco de dados chamado:

```sql
CREATE DATABASE "Software Security";
```

A estrutura e os dados iniciais devem ser configurados utilizando os arquivos:

- `database/schema.sql`
- `database/seed.sql`

Execute primeiro o `schema.sql` e depois o `seed.sql`, utilizando o pgAdmin ou o terminal PostgreSQL.

**Importante:** o `schema.sql` deve ser executado antes do `seed.sql`. Se o banco já possuir as tabelas, não execute scripts de criação indiscriminadamente sem verificar a estrutura existente.

## 4. Configuração das variáveis de ambiente

O projeto utiliza arquivos `.env` para armazenar configurações de conexão.

### 4.1. Backend Node.js

Na raiz do projeto, crie um arquivo chamado `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA
DB_NAME=Software Security

ML_API_URL=http://localhost:8000

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
```

Substitua `SUA_SENHA` pela senha definida durante a instalação do PostgreSQL.

A chave da OpenAI deve ser preenchida caso a funcionalidade de chat dependa dessa integração.

### 4.2. Serviço Python

Dentro da pasta `ml-service`, crie outro arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA
DB_NAME=Software Security
```

Utilize as mesmas credenciais do banco de dados configuradas no backend.

**Segurança:** nunca compartilhe ou envie arquivos `.env` para o GitHub. Utilize os arquivos `.env.example` como modelos de configuração.

## 5. Instalação e execução no Windows 11

Abra o PowerShell ou o terminal integrado do VS Code.

### 5.1. Instalação das dependências Node.js

Na raiz do projeto, execute:

```powershell
npm install
```

### 5.2. Configuração do serviço Python

Entre na pasta do serviço:

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

Caso a política de execução do PowerShell impeça a ativação do ambiente, utilize diretamente o executável do ambiente virtual nos comandos seguintes.

Caso não consiga ativar o ambiente virtual, execute os comandos utilizando diretamente o Python instalado dentro dele:

Instalação das dependências:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Inicialização do serviço:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

### 5.3. Inicialização do serviço Python

Ainda dentro de `ml-service`, execute:

```powershell
python -m uvicorn main:app --reload --port 8000
```

O serviço estará disponível em:

```text
http://localhost:8000
```

Documentação:

```text
http://localhost:8000/docs
```

### 5.4. Inicialização do backend Node.js

Abra outro terminal na raiz do projeto e execute:

```powershell
npm run dev
```

O backend estará disponível em:

```text
http://localhost:3000
```

Documentação Swagger:

```text
http://localhost:3000/docs
```

## 6. Instalação e execução no Linux

Abra o terminal na pasta do projeto.

### 6.1. Instalação das dependências Node.js

Na raiz do projeto:

```bash
npm install
```

### 6.2. Configuração do serviço Python

Entre na pasta:

```bash
cd ml-service
```

Caso o sistema informe que o módulo `venv` não está disponível, instale o pacote correspondente à sua distribuição. Em sistemas Ubuntu e Debian, utilize:

```bash
sudo apt install python3-venv
```

Crie o ambiente virtual:

```bash
python3 -m venv .venv
```

Ative o ambiente:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

### 6.3. Inicialização do serviço Python

Execute:

```bash
python -m uvicorn main:app --reload --port 8000
```

O serviço estará disponível em:

```text
http://localhost:8000
```

Documentação:

```text
http://localhost:8000/docs
```

### 6.4. Inicialização do backend Node.js

Abra outro terminal na raiz do projeto e execute:

```bash
npm run dev
```

O backend estará disponível em:

```text
http://localhost:3000
```

Documentação Swagger:

```text
http://localhost:3000/docs
```

## 7. Execução completa do sistema

Para executar o backend e o serviço de Machine Learning, são necessários dois terminais independentes.

| Terminal | Serviço | Porta |
|---|---|---|
| Terminal 1 | Node.js + Express | 3000 |
| Terminal 2 | Python + FastAPI | 8000 |

O PostgreSQL também deverá estar em execução na porta 5432.

A comunicação entre os serviços depende das variáveis de ambiente configuradas nos arquivos `.env`.

## 8. Verificação da instalação

Após iniciar os serviços, acesse:

**Backend:**

```text
http://localhost:3000
```

**Status do banco de dados:**

```text
http://localhost:3000/db-status
```

**Swagger do backend:**

```text
http://localhost:3000/docs
```

**Swagger do serviço Python:**

```text
http://localhost:8000/docs
```

Se as páginas estiverem acessíveis e o endpoint de banco de dados retornar conexão estabelecida, os principais serviços estarão disponíveis.

## 9. Problemas comuns

### Erro de conexão com PostgreSQL

Verifique:
- Se o PostgreSQL está em execução.
- Se a porta configurada está correta.
- Se usuário e senha estão corretos.
- Se o banco de dados foi criado.
- Se os arquivos `.env` estão preenchidos corretamente.

### Erro ao instalar dependências Node.js

Verifique a instalação do Node.js e do npm:

```bash
node -v
npm -v
```

### Erro ao iniciar o serviço Python

Verifique se o ambiente virtual está ativo e se as dependências foram instaladas:

```bash
pip install -r requirements.txt
```

### Porta já em utilização

Verifique se outro processo já está utilizando a porta 3000, 8000 ou 5432.

## 10. Observações

- O serviço Node.js e o serviço Python devem permanecer em execução durante a utilização das funcionalidades que dependem deles.
- O ambiente virtual Python (`.venv`) deve ser criado individualmente em cada computador.
- As dependências Python devem ser instaladas utilizando o arquivo `requirements.txt`.
- Os arquivos `.env` são individuais para cada ambiente.
- O simulador utiliza dados artificiais para representar o funcionamento dos sensores.
- O sistema não realiza acionamentos reais de serviços de emergência.