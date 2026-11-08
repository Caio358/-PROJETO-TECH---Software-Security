
-- SOFTWARE SECURITY
-- DADOS INICIAIS DOS SENSORES

INSERT INTO sensores (nome, tipo, ambiente, status)
SELECT dados.nome, dados.tipo, dados.ambiente, 'ATIVO'
FROM (
    VALUES
        ('Sensor de Movimento Sala', 'MOVIMENTO', 'Sala'),
        ('Sensor de Presença Quarto', 'PRESENCA', 'Quarto'),
        ('Sensor Porta Principal', 'PORTA', 'Entrada'),
        ('Sensor Janela Cozinha', 'JANELA', 'Cozinha'),
        ('Sensor Temperatura Cozinha', 'TEMPERATURA', 'Cozinha'),
        ('Sensor de Fumaça Cozinha', 'FUMACA', 'Cozinha'),
        ('Sensor de Movimento Escritório', 'MOVIMENTO', 'Escritório')
) AS dados(nome, tipo, ambiente)
WHERE NOT EXISTS (
    SELECT 1
    FROM sensores s
    WHERE s.nome = dados.nome
      AND s.tipo = dados.tipo
      AND s.ambiente = dados.ambiente
);
