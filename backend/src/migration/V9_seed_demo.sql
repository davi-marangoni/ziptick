-- =============================================================
-- SEED DE DEMONSTRAÇÃO — Fluxo de TI
-- Suporte Técnico → Infraestrutura → Desenvolvimento → Design
-- Senha de todos os usuários: 123456
-- =============================================================

-- ============================================================
-- SETORES
-- ============================================================
INSERT INTO public.seto_setor (seto_nome) VALUES
    ('Suporte Técnico'),
    ('Infraestrutura'),
    ('Desenvolvimento'),
    ('Design / UX'),
    ('Gerência de TI');

-- ============================================================
-- USUÁRIOS
-- Hash bcrypt 12 rounds de "123456"
-- ============================================================
INSERT INTO public.usua_usuario
    (usua_email, usua_senha, usua_tipo_usuario, usua_nome, usua_aceitou_termos, usua_seto_id, usua_cargo)
VALUES
    -- Admin do sistema
    ('admin@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     1, 'Administrador ZipTick', TRUE, NULL, 'Administrador do Sistema'),

    -- Gerente de TI (tipo 2)
    ('rodrigo.gerente@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     2, 'Rodrigo Ferreira', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Gerência de TI'),
     'Gerente de TI'),

    -- Funcionários — Suporte Técnico (tipo 3)
    ('ana.suporte@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'Ana Costa', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
     'Analista de Suporte N1'),

    ('joao.suporte@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'João Lima', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
     'Analista de Suporte N2'),

    -- Funcionário — Infraestrutura (tipo 3)
    ('carlos.infra@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'Carlos Mendes', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'),
     'Analista de Infraestrutura'),

    -- Funcionários — Desenvolvimento (tipo 3)
    ('paula.dev@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'Paula Oliveira', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
     'Desenvolvedora Full Stack'),

    ('marcos.dev@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'Marcos Souza', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
     'Desenvolvedor Backend'),

    -- Funcionária — Design / UX (tipo 3)
    ('lucia.design@ziptick.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     3, 'Lúcia Martins', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'),
     'Designer UX/UI'),

    -- Usuários externos — clientes (tipo 4)
    ('ricardo.cliente@empresa.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     4, 'Ricardo Alves', TRUE, NULL, NULL),

    ('fernanda.cliente@empresa.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     4, 'Fernanda Silva', TRUE, NULL, NULL),

    ('thiago.cliente@empresa.com',
     '$2b$12$lWzmksleqhyiWQhtqM4pNuuKmGFKurK5.ojgIBn37yIgMVN4W3Ira',
     4, 'Thiago Rocha', TRUE, NULL, NULL)
ON CONFLICT (usua_email) DO NOTHING;

-- ============================================================
-- COLUNAS KANBAN ESPECÍFICAS POR SETOR
-- ============================================================

-- Desenvolvimento: fluxo de código
INSERT INTO public.coka_kanban_coluna (coka_titulo, coka_ordem, coka_seto_id) VALUES
    ('Backlog',      1, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    ('Em Análise',   2, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    ('Em Progresso', 3, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    ('Code Review',  4, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    ('Deploy',       5, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    ('Concluído',    6, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'));

-- Design: fluxo criativo
INSERT INTO public.coka_kanban_coluna (coka_titulo, coka_ordem, coka_seto_id) VALUES
    ('Briefing',        1, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    ('Prototipagem',    2, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    ('Em Criação',      3, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    ('Revisão Cliente', 4, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    ('Aprovado',        5, (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'));

-- ============================================================
-- CAMPOS CUSTOMIZADOS POR SETOR
-- ============================================================

-- Suporte Técnico
INSERT INTO public.cacu_campo_customizado (cacu_label, cacu_tipo, cacu_obrigatorio, cacu_seto_id, cacu_ordem, cacu_opcoes)
VALUES
    ('Equipamento afetado', 'texto', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'), 1, NULL),
    ('Sistema operacional', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'), 2,
     '["Windows","Linux","macOS","Android","iOS"]'),
    ('Urgência', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'), 3,
     '["Baixa","Média","Alta","Crítica"]'),
    ('Número de série / patrimônio', 'texto', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'), 4, NULL);

-- Infraestrutura
INSERT INTO public.cacu_campo_customizado (cacu_label, cacu_tipo, cacu_obrigatorio, cacu_seto_id, cacu_ordem, cacu_opcoes)
VALUES
    ('Servidor / Serviço afetado', 'texto', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'), 1, NULL),
    ('Ambiente', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'), 2,
     '["Produção","Homologação","Desenvolvimento","Laboratório"]'),
    ('Impacto no negócio', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'), 3,
     '["Nenhum","Parcial — degradação de desempenho","Total — serviço indisponível"]'),
    ('Janela de manutenção aceita', 'checkbox', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'), 4, NULL);

-- Desenvolvimento
INSERT INTO public.cacu_campo_customizado (cacu_label, cacu_tipo, cacu_obrigatorio, cacu_seto_id, cacu_ordem, cacu_opcoes)
VALUES
    ('Módulo / Sistema', 'texto', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'), 1, NULL),
    ('Tipo de solicitação', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'), 2,
     '["Bug","Nova Funcionalidade","Melhoria","Refatoração","Documentação","Integração"]'),
    ('URL do repositório', 'texto', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'), 3, NULL),
    ('Versão afetada', 'texto', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'), 4, NULL);

-- Design / UX
INSERT INTO public.cacu_campo_customizado (cacu_label, cacu_tipo, cacu_obrigatorio, cacu_seto_id, cacu_ordem, cacu_opcoes)
VALUES
    ('Tipo de entrega', 'select', TRUE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'), 1,
     '["Wireframe","Protótipo interativo","Arte Final","Identidade Visual","Ícone","Banner","Apresentação"]'),
    ('Formato de arquivo', 'select', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'), 2,
     '["PNG","SVG","PDF","Figma","PSD","AI","MP4"]'),
    ('Dimensões / Especificações', 'texto', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'), 3, NULL),
    ('Prazo desejado', 'data', FALSE,
     (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'), 4, NULL);

-- ============================================================
-- CHAMADOS DE DEMONSTRAÇÃO
-- ============================================================

-- ---- SUPORTE TÉCNICO ----------------------------------------

-- Chamado 1: Em andamento — alta prioridade
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Notebook não liga após atualização do Windows',
    E'O notebook do setor financeiro parou de ligar após a atualização automática do Windows 11 realizada ontem à noite.\n\nAo pressionar o botão de energia, a luz de power acende por 2 segundos e a tela permanece completamente preta.\n\nEquipamento: Dell Latitude 5520 — patrimônio #1042',
    3, 'ricardo.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
    'ana.suporte@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Em Andamento' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 hours';

-- Chamado 2: Triagem — baixa prioridade
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Impressora do RH não imprime em cores',
    E'A impressora HP Color LaserJet M452 do setor de Recursos Humanos está imprimindo apenas em preto e branco, mesmo para documentos coloridos.\n\nJá realizei a substituição dos cartuchos coloridos, mas o problema persistiu. A impressora em si está reconhecendo os cartuchos novos (a tela não aponta nenhum erro).',
    1, 'fernanda.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
    'joao.suporte@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Triagem' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day';

-- Chamado 3: Aguardando (aprovação de compra)
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Solicitação de equipamento para novo estagiário',
    E'O setor comercial contratou um estagiário que inicia na semana que vem (segunda-feira).\n\nNecessário provisionar:\n- 1 computador (mínimo i5, 16 GB RAM, SSD 256 GB)\n- 1 monitor\n- Teclado e mouse\n\nPor favor agilizar a aprovação junto à gerência para termos tempo de configurar o ambiente.',
    1, 'fernanda.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
    'ana.suporte@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Aguardando' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days';

-- Chamado 4: Concluído
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Reset de senha — acesso bloqueado ao sistema ERP',
    E'Meu acesso ao sistema ERP foi bloqueado após 5 tentativas incorretas de senha. Preciso de desbloqueio e reset urgente pois tenho fechamento de mês hoje.',
    2, 'thiago.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico'),
    'joao.suporte@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Concluído' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days';

-- ---- INFRAESTRUTURA -----------------------------------------

-- Chamado 5: Triagem — alta prioridade (incidente)
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Servidor web-prod-01 com alta utilização de CPU',
    E'INCIDENTE — O servidor web-prod-01 está com 97% de CPU desde as 14h32 de hoje.\n\nSintomas:\n- Tempo de resposta do site aumentou de 200ms para 8s\n- Ocorreram 5 timeouts na última hora\n- Clientes estão reportando lentidão pelo chat de suporte\n\nPreciso de investigação urgente. Monitoramento: Grafana/alertmanager já disparou alerta crítico.',
    3, 'rodrigo.gerente@ziptick.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'),
    'carlos.infra@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Triagem' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours';

-- Chamado 6: Em andamento — VPN
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Configuração de VPN para 3 colaboradores remotos',
    E'Três novos colaboradores iniciaram no regime de trabalho 100% remoto esta semana e ainda não têm acesso à VPN corporativa.\n\nDados:\n- Luana Pires — luana.pires@empresa.com\n- Pedro Nunes — pedro.nunes@empresa.com\n- Sofia Castro — sofia.castro@empresa.com\n\nTodos usam Windows 11. Por favor provisionar acesso e enviar as instruções de configuração.',
    2, 'rodrigo.gerente@ziptick.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura'),
    'carlos.infra@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna WHERE coka_titulo = 'Em Andamento' AND coka_seto_id IS NULL),
    NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day';

-- ---- DESENVOLVIMENTO ----------------------------------------

-- Chamado 7: Em andamento — bug crítico
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Erro 500 ao exportar relatório de vendas mensais',
    E'BUG CRÍTICO — Ao clicar em "Exportar Relatório" no módulo Financeiro > Vendas Mensais, o sistema retorna HTTP 500.\n\nO problema ocorre especificamente quando o período selecionado contém mais de 1.000 registros. Relatórios menores exportam normalmente.\n\nImpacto: toda a diretoria financeira está sem conseguir gerar os relatórios de fechamento de mês.\n\nStack trace registrado nos logs de hoje às 09:14.',
    3, 'ricardo.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
    'paula.dev@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Em Progresso'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 hours';

-- Chamado 8: Em análise — nova funcionalidade
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Exportação de listagem de clientes em CSV',
    E'O módulo de clientes atualmente permite exportação apenas em PDF. A equipe de análise de dados precisa dos dados em CSV para trabalhar no Excel e Power BI.\n\nEscopado:\n- Botão "Exportar CSV" na tela de listagem\n- Respeitar os filtros ativos no momento da exportação\n- Colunas: ID, Nome, CPF/CNPJ, E-mail, Telefone, Data de cadastro, Status\n- Encoding UTF-8 com BOM (compatível com Excel brasileiro)',
    2, 'fernanda.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
    'marcos.dev@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Em Análise'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days';

-- Chamado 9: Code Review — concluindo bug
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Validação de CPF inválida no cadastro de clientes',
    E'O campo CPF no formulário de cadastro de clientes está aceitando qualquer sequência de 11 dígitos, incluindo CPFs inválidos como "111.111.111-11".\n\nA validação de dígitos verificadores não está sendo aplicada. O problema existe no frontend (sem feedback visual) e provavelmente no backend também.',
    2, 'thiago.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
    'paula.dev@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Code Review'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day';

-- Chamado 10: Concluído no Desenvolvimento
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Integração com API dos Correios para cálculo de frete',
    E'Implementar integração com a API REST dos Correios (webmaniabr) para:\n1. Cálculo automático de prazo e valor de frete no checkout\n2. Rastreamento de encomendas na área do cliente\n\nChave de API já adquirida — credenciais enviadas por e-mail seguro ao time.',
    2, 'ricardo.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento'),
    'marcos.dev@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Concluído'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '20 days';

-- ---- DESIGN / UX --------------------------------------------

-- Chamado 11: Em criação
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Nova identidade visual para campanha de fim de ano',
    E'Precisamos de uma identidade visual completa para a campanha de marketing de fim de ano.\n\nEntregas esperadas:\n- Logotipo da campanha (horizontal + vertical)\n- Paleta de cores e tipografia\n- Templates para Instagram (feed, stories e reels)\n- Template para LinkedIn\n- Template para e-mail marketing (header)\n\nPrazo: até o dia 15 do próximo mês.',
    2, 'rodrigo.gerente@ziptick.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'),
    'lucia.design@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Em Criação'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day';

-- Chamado 12: Briefing — novo chamado
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Redesenho da tela de login do sistema ERP',
    E'A tela de login do ERP está visualmente desatualizada e não segue o design system da empresa.\n\nRequisitos:\n- Seguir as diretrizes do design system (cores primárias, tipografia Inter, bordas arredondadas)\n- Conformidade com WCAG 2.1 nível AA (acessibilidade)\n- Layout responsivo (mobile e desktop)\n- Entregar em Figma com componentes documentados\n\nReferência de estilo: site institucional da empresa.',
    1, 'fernanda.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'),
    'lucia.design@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Briefing'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days';

-- Chamado 13: Aprovado — concluído
INSERT INTO public.cham_chamado
    (cham_titulo, cham_descricao, cham_prioridade, cham_usua_email,
     cham_seto_id, cham_func_email, cham_coka_id, cham_criado_em, cham_atualizado_em)
SELECT
    'Ícones para o novo módulo de relatórios',
    E'Necessário criar um conjunto de 12 ícones para o novo módulo de relatórios do sistema:\n\n- relatório de vendas, financeiro, estoque, clientes, fornecedores, frete, devolução, comissão, meta, comparativo, exportar, filtrar\n\nEstilo: outline, traço 2px, grade 24×24px.\nEntrega em SVG (otimizado com SVGO) e PNG 2x.',
    1, 'thiago.cliente@empresa.com',
    (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX'),
    'lucia.design@ziptick.com',
    (SELECT coka_id FROM public.coka_kanban_coluna
     WHERE coka_titulo = 'Aprovado'
       AND coka_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
    NOW() - INTERVAL '20 days', NOW() - INTERVAL '10 days';

-- ============================================================
-- VALORES DOS CAMPOS CUSTOMIZADOS
-- ============================================================

-- Chamado 1 — Suporte: campos preenchidos
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Equipamento afetado'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico')),
        'Dell Latitude 5520'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Sistema operacional'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico')),
        'Windows'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Urgência'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico')),
        'Alta'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Número de série / patrimônio'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Suporte Técnico')),
        '#1042'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- Chamado 5 — Infraestrutura: incidente em produção
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Servidor web-prod-01 com alta utilização de CPU'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Servidor / Serviço afetado'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura')),
        'web-prod-01 / nginx + app Node.js'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Servidor web-prod-01 com alta utilização de CPU'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Ambiente'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura')),
        'Produção'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Servidor web-prod-01 com alta utilização de CPU'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Impacto no negócio'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Infraestrutura')),
        'Parcial — degradação de desempenho'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- Chamado 7 — Desenvolvimento: bug crítico
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Erro 500 ao exportar relatório de vendas mensais'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Módulo / Sistema'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
        'Financeiro / Relatórios'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Erro 500 ao exportar relatório de vendas mensais'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Tipo de solicitação'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
        'Bug'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Erro 500 ao exportar relatório de vendas mensais'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Versão afetada'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
        'v2.14.3 (produção)'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- Chamado 8 — Desenvolvimento: nova funcionalidade
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Exportação de listagem de clientes em CSV'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Módulo / Sistema'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
        'CRM / Clientes'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Exportação de listagem de clientes em CSV'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Tipo de solicitação'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Desenvolvimento')),
        'Nova Funcionalidade'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- Chamado 11 — Design: campanha
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Nova identidade visual para campanha de fim de ano'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Tipo de entrega'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
        'Identidade Visual'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Nova identidade visual para campanha de fim de ano'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Formato de arquivo'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
        'AI'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- Chamado 13 — Design: ícones concluídos
INSERT INTO public.cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
VALUES
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Ícones para o novo módulo de relatórios'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Tipo de entrega'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
        'Ícone'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Ícones para o novo módulo de relatórios'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Formato de arquivo'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
        'SVG'
    ),
    (
        (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Ícones para o novo módulo de relatórios'),
        (SELECT cacu_id FROM public.cacu_campo_customizado WHERE cacu_label = 'Dimensões / Especificações'
         AND cacu_seto_id = (SELECT seto_id FROM public.seto_setor WHERE seto_nome = 'Design / UX')),
        '24×24px, traço 2px, estilo outline'
    )
ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO NOTHING;

-- ============================================================
-- NOTIFICAÇÕES DE DEMONSTRAÇÃO
-- ============================================================
INSERT INTO public.noti_notificacao (noti_usua_email, noti_mensagem, noti_tipo, noti_cham_id, noti_lida, noti_criado_em)
VALUES
    -- Para a ana (funcionária de suporte)
    ('ana.suporte@ziptick.com',
     'Novo chamado atribuído: "Notebook não liga após atualização do Windows"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
     FALSE, NOW() - INTERVAL '2 days'),

    ('ana.suporte@ziptick.com',
     'Novo chamado atribuído: "Solicitação de equipamento para novo estagiário"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Solicitação de equipamento para novo estagiário'),
     TRUE, NOW() - INTERVAL '8 days'),

    -- Para o João (suporte N2)
    ('joao.suporte@ziptick.com',
     'Novo chamado atribuído: "Impressora do RH não imprime em cores"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Impressora do RH não imprime em cores'),
     FALSE, NOW() - INTERVAL '1 day'),

    -- Para Carlos (infra)
    ('carlos.infra@ziptick.com',
     'URGENTE — Novo chamado atribuído: "Servidor web-prod-01 com alta utilização de CPU"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Servidor web-prod-01 com alta utilização de CPU'),
     FALSE, NOW() - INTERVAL '3 hours'),

    -- Para Paula (dev)
    ('paula.dev@ziptick.com',
     'Novo chamado atribuído: "Erro 500 ao exportar relatório de vendas mensais"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Erro 500 ao exportar relatório de vendas mensais'),
     FALSE, NOW() - INTERVAL '1 day'),

    ('paula.dev@ziptick.com',
     'Chamado concluído: "Validação de CPF inválida no cadastro de clientes" passou para Code Review',
     'conclusao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Validação de CPF inválida no cadastro de clientes'),
     TRUE, NOW() - INTERVAL '1 day'),

    -- Para Lúcia (design)
    ('lucia.design@ziptick.com',
     'Novo chamado atribuído: "Nova identidade visual para campanha de fim de ano"',
     'atribuicao',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Nova identidade visual para campanha de fim de ano'),
     FALSE, NOW() - INTERVAL '5 days'),

    -- Para o cliente Ricardo
    ('ricardo.cliente@empresa.com',
     'Seu chamado "Notebook não liga após atualização do Windows" está Em Andamento',
     'abertura',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Notebook não liga após atualização do Windows'),
     FALSE, NOW() - INTERVAL '2 days'),

    -- Para o gerente
    ('rodrigo.gerente@ziptick.com',
     'Incidente crítico aberto: "Servidor web-prod-01 com alta utilização de CPU"',
     'abertura',
     (SELECT cham_id FROM public.cham_chamado WHERE cham_titulo = 'Servidor web-prod-01 com alta utilização de CPU'),
     FALSE, NOW() - INTERVAL '3 hours');
