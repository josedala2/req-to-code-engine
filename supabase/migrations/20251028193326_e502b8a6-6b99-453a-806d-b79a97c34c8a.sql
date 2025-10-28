-- Adicionar a opção 'mista' ao tipo de produção
-- Primeiro, precisamos verificar se o tipo é uma string ou um enum

-- Se for um campo de texto simples, não precisamos fazer nada
-- Se for um enum, precisamos adicionar o novo valor

-- Verificando a estrutura atual e adicionando 'mista' como opção válida
-- Como tipo_producao é text, apenas precisamos garantir que o campo aceita o valor

-- Adicionar comentário documentando os valores aceitos
COMMENT ON COLUMN produtores.tipo_producao IS 'Tipo de produção de café: com_sombra, sem_sombra ou mista';