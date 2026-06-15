CREATE TABLE IF NOT EXISTS public.seto_setor (
    seto_id        SERIAL PRIMARY KEY,
    seto_nome      VARCHAR(100) NOT NULL UNIQUE,
    seto_criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.usua_usuario
    ADD COLUMN IF NOT EXISTS usua_seto_id INTEGER REFERENCES public.seto_setor(seto_id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS usua_cargo   VARCHAR(100);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seto_setor TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.seto_setor_seto_id_seq TO usuario_api_ziptick;
