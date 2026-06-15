CREATE TABLE IF NOT EXISTS public.cham_chamado (
    cham_id            SERIAL PRIMARY KEY,
    cham_titulo        VARCHAR(200) NOT NULL,
    cham_descricao     TEXT,
    cham_prioridade    SMALLINT    DEFAULT 0, -- 0=sem 1=baixa 2=média 3=alta
    cham_usua_email    VARCHAR(255) REFERENCES public.usua_usuario(usua_email) ON DELETE SET NULL,
    cham_seto_id       INTEGER     REFERENCES public.seto_setor(seto_id) ON DELETE SET NULL,
    cham_func_email    VARCHAR(255) REFERENCES public.usua_usuario(usua_email) ON DELETE SET NULL,
    cham_criado_em     TIMESTAMP   DEFAULT NOW(),
    cham_atualizado_em TIMESTAMP   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.anex_anexo (
    anex_id        SERIAL PRIMARY KEY,
    anex_cham_id   INTEGER      NOT NULL REFERENCES public.cham_chamado(cham_id) ON DELETE CASCADE,
    anex_nome      VARCHAR(255) NOT NULL,
    anex_url       VARCHAR(500) NOT NULL,
    anex_criado_em TIMESTAMP    DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cham_chamado TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.cham_chamado_cham_id_seq TO usuario_api_ziptick;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.anex_anexo TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.anex_anexo_anex_id_seq TO usuario_api_ziptick;
