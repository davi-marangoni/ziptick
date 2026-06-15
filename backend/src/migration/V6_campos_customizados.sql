CREATE TABLE IF NOT EXISTS public.cacu_campo_customizado (
    cacu_id          SERIAL PRIMARY KEY,
    cacu_label       VARCHAR(100) NOT NULL,
    cacu_tipo        VARCHAR(20)  NOT NULL, -- texto, numero, data, select, checkbox
    cacu_obrigatorio BOOLEAN      DEFAULT FALSE,
    cacu_seto_id     INTEGER      REFERENCES public.seto_setor(seto_id) ON DELETE CASCADE,
    cacu_ordem       SMALLINT     DEFAULT 0,
    cacu_opcoes      TEXT,        -- JSON array para tipo=select
    cacu_criado_em   TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cacv_campo_valor (
    cacv_id      SERIAL  PRIMARY KEY,
    cacv_cham_id INTEGER NOT NULL REFERENCES public.cham_chamado(cham_id) ON DELETE CASCADE,
    cacv_cacu_id INTEGER NOT NULL REFERENCES public.cacu_campo_customizado(cacu_id) ON DELETE CASCADE,
    cacv_valor   TEXT,
    UNIQUE (cacv_cham_id, cacv_cacu_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cacu_campo_customizado TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.cacu_campo_customizado_cacu_id_seq TO usuario_api_ziptick;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cacv_campo_valor TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.cacv_campo_valor_cacv_id_seq TO usuario_api_ziptick;
