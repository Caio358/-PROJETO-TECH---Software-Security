# Sentinela — Segurança Inteligente

Interface web responsiva para o projeto acadêmico de segurança residencial. A direção visual usa como referência o Figma enviado: azul-marinho, azul vivo, superfícies azul-acinzentadas, cartões arredondados e indicadores em verde. A estrutura e o modo de demonstração usam os conceitos, os sensores e os caminhos de API encontrados no repositório original.

## Requisitos

- Node.js 20 ou superior
- pnpm 11.25.0 (a versão usada está fixada em `package.json`)

## Executar localmente

```bash
pnpm install
pnpm dev
```

A aplicação abre na porta `5173`. Para gerar os arquivos estáticos de produção: `pnpm build`; a saída fica em `dist/`.

## Executar com o backend

Com o backend do repositório Software Security iniciado na porta `3001`, copie o arquivo de exemplo:

```bash
cp .env.example .env
```

O valor padrão de `VITE_API_BASE_URL` já aponta para `http://localhost:3001`. Se o backend estiver em outra URL, altere esse valor antes de iniciar o Vite ou informe a URL em **Administração → Integração**.

O front e o backend devem usar portas diferentes:

```text
Front-end: http://localhost:5173
Backend:   http://localhost:3001
```

## Como os dados funcionam

Por padrão, o sistema usa dados demonstrativos e os mantém no `localStorage` deste navegador. Câmeras são cartões de prévia ilustrativos — não existe transmissão de vídeo nessa interface. Mudanças no modo demonstrativo não comandam sensores ou equipamentos físicos. O chatbot também usa respostas predefinidas.

Para conectar uma instância da API do repositório, use a tela inicial de **Login/Cadastro** ou abra **Administração → Integração** e informe a URL-base do backend (por exemplo, `http://localhost:3001`). O cadastro envia `POST /usuarios` e o login usa `POST /usuarios/login`; o backend grava o usuário na tabela `usuarios` do PostgreSQL. A interface consulta `/`, `/sensores`, `/ocorrencias`, `/alertas` e `/configuracao-residencia`, usando os contratos documentados no backend. Ela também usa `PUT /sensores/:id`, `PATCH /alertas/:id/status`, `PATCH /ocorrencias/:id/status`, `PATCH /configuracao-residencia/modo-seguranca` e `POST /chat/mensagem` para ações compatíveis.

Na tela **Simulação**, o front chama `POST /simulador/iniciar`, `POST /simulador/parar`, `GET /simulador/status` e `POST /simulador/cenario`, permitindo demonstrar a geração de leituras e eventos artificiais. O backend precisa estar executando e aceitar CORS para a origem da interface. Endpoints não configurados ou indisponíveis não são simulados como conexão real.

O código não inclui credenciais nem chaves de API. O serviço de chat do backend depende da configuração própria desse serviço.

## Estrutura

- `src/App.jsx`: estado, navegação, ações e telas principais.
- `src/pages/`: telas do painel, monitoramento, dispositivos, alertas, histórico e administração.
- `src/components/`: componentes reutilizáveis, câmera, modal e chatbot.
- `src/data/demoData.js`: conjunto local demonstrativo.
- `src/services/securityApi.js`: adaptador para os endpoints reais.
- `src/services/authApi.js`: cadastro e login de usuários.
- `src/services/simulatorApi.js`: controle da simulação de sensores.
- `src/styles.css`: identidade visual, responsividade e estados.
