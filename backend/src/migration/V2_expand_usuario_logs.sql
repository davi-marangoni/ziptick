-- V2: expande usua_usuario com campos de auditoria e cria tabela de logs

ALTER TABLE public.usua_usuario
    ADD COLUMN IF NOT EXISTS usua_nome           VARCHAR(150),
    ADD COLUMN IF NOT EXISTS usua_ip_criacao     VARCHAR(45),
    ADD COLUMN IF NOT EXISTS usua_criado_em      TIMESTAMP DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS usua_aceitou_termos BOOLEAN   DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.log_acao (
    log_id         SERIAL PRIMARY KEY,
    log_usua_email VARCHAR(255) REFERENCES public.usua_usuario(usua_email) ON DELETE SET NULL,
    log_acao       VARCHAR(100) NOT NULL,
    log_descricao  TEXT,
    log_ip         VARCHAR(45),
    log_criado_em  TIMESTAMP DEFAULT NOW()
);

GRANT SELECT, INSERT ON public.log_acao TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.log_acao_log_id_seq TO usuario_api_ziptick;
GRANT UPDATE ON public.usua_usuario TO usuario_api_ziptick;
