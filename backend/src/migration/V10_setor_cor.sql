-- V10: Adiciona coluna de cor hexadecimal ao setor
ALTER TABLE public.seto_setor
    ADD COLUMN seto_cor VARCHAR(7) NOT NULL DEFAULT '#6b7280';

-- Define cores para os setores de demonstração
UPDATE public.seto_setor SET seto_cor = '#3b82f6' WHERE seto_nome = 'Suporte Técnico';
UPDATE public.seto_setor SET seto_cor = '#f97316' WHERE seto_nome = 'Infraestrutura';
UPDATE public.seto_setor SET seto_cor = '#8b5cf6' WHERE seto_nome = 'Desenvolvimento';
UPDATE public.seto_setor SET seto_cor = '#ec4899' WHERE seto_nome = 'Design / UX';
UPDATE public.seto_setor SET seto_cor = '#22c55e' WHERE seto_nome = 'Gerência de TI';
