create database ziptick;

-- DROP ROLE usuario_api;

CREATE ROLE usuario_api_ziptick WITH
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	NOINHERIT
	LOGIN
	NOREPLICATION
	NOBYPASSRLS
	CONNECTION LIMIT -1;

-- Permissions

GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE public.usua_usuario TO usuario_api_ziptick;

ALTER ROLE usuario_api_ziptick WITH PASSWORD 'SENHA QUE VOCE QUISER';

-- public.usua_usuario definição

-- Drop table

-- DROP TABLE public.usua_usuario;

create table public.usua_usuario ( usua_email varchar(255) not null,
usua_senha varchar(100) null,
usua_tipo_usuario int4 null,
constraint usua_usuario_pkey primary key (usua_email));

-- Permissions

ALTER TABLE public.usua_usuario OWNER TO postgres;
GRANT ALL ON TABLE public.usua_usuario TO postgres;
GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE public.usua_usuario TO postgres;
GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE public.usua_usuario TO usuario_api_ziptick;


--USUÁRIO DE TESTE. senha 123456
INSERT INTO public.usua_usuario (usua_email, usua_senha, usua_tipo_usuario) VALUES('teste@gmail.com', '$2b$12$CmFpn5Ypgwh/q3v2hQ7I5.k/gxyqiHgqVkvEQvBJ7WdVZ82Vy0VAC', 1);








