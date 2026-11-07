# Banco de Dados — Sistema Integrado de Segurança Inteligente

## 1. Visão Geral

O módulo `database` é responsável por documentar a estrutura de armazenamento e o gerenciamento das informações utilizadas pelo Sistema Integrado de Segurança Inteligente.

O banco de dados centraliza as informações necessárias para o funcionamento do sistema, permitindo registrar usuários, dispositivos, ocorrências, análises realizadas pelo serviço de Machine Learning e atualizações no histórico de eventos.

A tecnologia e o modelo definitivo de banco de dados ainda serão definidos pela equipe durante o desenvolvimento.

## 2. Objetivos

- Organizar e armazenar os dados do sistema.
- Garantir a integridade e a consistência das informações.
- Permitir consultas e atualizações realizadas pelo Backend.
- Registrar ocorrências identificadas pelos dispositivos de monitoramento.
- Armazenar resultados das análises realizadas pelo serviço de Machine Learning.
- Manter o histórico das ocorrências e de seus respectivos estados.

## 3. Entidades Previstas

As entidades abaixo representam uma proposta inicial de modelagem. Seus atributos e relacionamentos deverão ser definidos e validados pela equipe.

### 3.1 Usuários

Armazena informações dos usuários autorizados a acessar o sistema.

Possíveis informações:
- Identificador do usuário.
- Nome.
- E-mail.
- Credenciais armazenadas de forma segura.
- Perfil ou nível de acesso.
- Data de cadastro.

### 3.2 Dispositivos e Sensores

Armazena informações dos equipamentos responsáveis pelo monitoramento dos ambientes.

Possíveis informações:
- Identificador do dispositivo.
- Nome ou identificação.
- Tipo de sensor.
- Localização ou ambiente monitorado.
- Estado de funcionamento.
- Data de cadastro.

