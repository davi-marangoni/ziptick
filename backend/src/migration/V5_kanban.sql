CREATE TABLE IF NOT EXISTS public.coka_kanban_coluna (
    coka_id        SERIAL PRIMARY KEY,
    coka_titulo    VARCHAR(100) NOT NULL,
    coka_ordem     SMALLINT    DEFAULT 0,
    coka_seto_id   INTEGER     REFERENCES public.seto_setor(seto_id) ON DELETE SET NULL,
    coka_criado_em TIMESTAMP   DEFAULT NOW()
);

-- Colunas padrão globais (seto_id NULL = todas as equipes)
INSERT INTO public.coka_kanban_coluna (coka_titulo, coka_ordem) VALUES
    ('Triagem',       1),
    ('Em Andamento',  2),
    ('Aguardando',    3),
    ('Concluído',     4)
ON CONFLICT DO NOTHING;

-- Referência FK do chamado para a coluna Kanban
ALTER TABLE public.cham_chamado
    ADD COLUMN IF NOT EXISTS cham_coka_id INTEGER REFERENCES public.coka_kanban_coluna(coka_id) ON DELETE SET NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.coka_kanban_coluna TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.coka_kanban_coluna_coka_id_seq TO usuario_api_ziptick;
