-- V8: tabela de tokens para recuperação de senha

CREATE TABLE IF NOT EXISTS public.reset_senha_token (
    rest_id         SERIAL PRIMARY KEY,
    rest_usua_email VARCHAR(255) NOT NULL REFERENCES public.usua_usuario(usua_email) ON DELETE CASCADE,
    rest_token      VARCHAR(200) NOT NULL UNIQUE,
    rest_expira_em  TIMESTAMP   NOT NULL,
    rest_usado      BOOLEAN     DEFAULT FALSE,
    rest_criado_em  TIMESTAMP   DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE ON public.reset_senha_token TO usuario_api_ziptick;
GRANT USAGE, SELECT ON SEQUENCE public.reset_senha_token_rest_id_seq TO usuario_api_ziptick;
