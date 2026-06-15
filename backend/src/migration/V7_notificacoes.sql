ALTER TABLE public.usua_usuario
    ADD COLUMN IF NOT EXISTS usua_telegram_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS usua_whatsapp    VARCHAR(20);

CREATE TABLE IF NOT EXISTS public.noti_notificacao (
    noti_id         SERIAL PRIMARY KEY,
    noti_usua_email VARCHAR(255) REFERENCES public.usua_usuario(usua_email) ON DELETE CASCADE,
    noti_cham_id    INTEGER      REFERENCES public.cham_chamado(cham_id) ON DELETE SET NULL,
    noti_mensagem   TEXT         NOT NULL,
    noti_tipo       VARCHAR(20)  DEFAULT 'interna', -- interna, email, telegram, whatsapp
    noti_lida       BOOLEAN      DEFAULT FALSE,
    noti_criado_em  TIMESTAMP    DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.noti_notificacao TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.noti_notificacao_noti_id_seq TO usuario_api_ziptick;
GRANT UPDATE ON public.usua_usuario TO usuario_api_ziptick;
