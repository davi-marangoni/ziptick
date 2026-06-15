import db from '../db/database';
import { Chamado, Anexo } from '../interface/chamado';

interface UsuarioLogado {
    email: string;
    tipo: number;
    seto_id?: number;
}

interface CriarChamadoInput {
    titulo: string;
    descricao?: string;
    seto_id?: number;
    usuarioLogado: UsuarioLogado;
    ip?: string;
    anexos?: { nome: string; url: string }[];
}

export class ChamadoService {

    public async criar(input: CriarChamadoInput): Promise<Chamado> {
        return db.tx(async t => {
            // Se Sprint 4+ estiver ativo, busca coluna "Triagem"
            const triagem = await t.oneOrNone<{ coka_id: number }>(
                `SELECT coka_id FROM coka_kanban_coluna WHERE coka_titulo = 'Triagem' LIMIT 1`
            );

            const chamado = await t.one<{ id: number }>(
                `INSERT INTO cham_chamado
                    (cham_titulo, cham_descricao, cham_usua_email, cham_seto_id, cham_coka_id, cham_criado_em, cham_atualizado_em)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                 RETURNING cham_id AS id`,
                [
                    input.titulo,
                    input.descricao || null,
                    input.usuarioLogado.email,
                    input.seto_id || null,
                    triagem?.coka_id || null
                ]
            );

            if (input.anexos?.length) {
                await t.batch(input.anexos.map(a =>
                    t.none(
                        'INSERT INTO anex_anexo (anex_cham_id, anex_nome, anex_url) VALUES ($1, $2, $3)',
                        [chamado.id, a.nome, a.url]
                    )
                ));
            }

            // Busca dados completos dentro da mesma transação (evita problema de
            // READ COMMITTED com conexão separada não enxergar o INSERT não commitado)
            const full = await t.one<Chamado>(
                `SELECT c.cham_id         AS id,
                        c.cham_titulo     AS titulo,
                        c.cham_descricao  AS descricao,
                        c.cham_prioridade AS prioridade,
                        c.cham_usua_email AS usua_email,
                        c.cham_func_email AS func_email,
                        c.cham_seto_id    AS seto_id,
                        s.seto_nome       AS setor_nome,
                        c.cham_coka_id    AS coka_id,
                        k.coka_titulo     AS coluna_titulo,
                        c.cham_criado_em  AS criado_em,
                        c.cham_atualizado_em AS atualizado_em
                 FROM cham_chamado c
                 LEFT JOIN seto_setor s ON s.seto_id = c.cham_seto_id
                 LEFT JOIN coka_kanban_coluna k ON k.coka_id = c.cham_coka_id
                 WHERE c.cham_id = $1`,
                [chamado.id]
            );

            const anexos = await t.any<Anexo>(
                `SELECT anex_id AS id, anex_cham_id AS cham_id, anex_nome AS nome,
                        anex_url AS url, anex_criado_em AS criado_em
                 FROM anex_anexo WHERE anex_cham_id = $1`,
                [chamado.id]
            );

            return { ...full, anexos };
        });
    }

    public async listar(usuarioLogado: UsuarioLogado, filtros?: { seto_id?: number; coka_id?: number }): Promise<Chamado[]> {
        const conditions: string[] = [];
        const params: any[] = [];
        let p = 1;

        // Regra de visibilidade
        if (usuarioLogado.tipo === 4) {
            conditions.push(`c.cham_usua_email = $${p++}`);
            params.push(usuarioLogado.email);
        } else if (usuarioLogado.tipo === 3 && usuarioLogado.seto_id) {
            conditions.push(`c.cham_seto_id = $${p++}`);
            params.push(usuarioLogado.seto_id);
        }

        if (filtros?.seto_id) {
            conditions.push(`c.cham_seto_id = $${p++}`);
            params.push(filtros.seto_id);
        }
        if (filtros?.coka_id) {
            conditions.push(`c.cham_coka_id = $${p++}`);
            params.push(filtros.coka_id);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        return db.any<Chamado>(
            `SELECT c.cham_id         AS id,
                    c.cham_titulo     AS titulo,
                    c.cham_descricao  AS descricao,
                    c.cham_prioridade AS prioridade,
                    c.cham_usua_email AS usua_email,
                    c.cham_func_email AS func_email,
                    c.cham_seto_id    AS seto_id,
                    s.seto_nome       AS setor_nome,
                    c.cham_coka_id    AS coka_id,
                    k.coka_titulo     AS coluna_titulo,
                    c.cham_criado_em  AS criado_em,
                    c.cham_atualizado_em AS atualizado_em
             FROM cham_chamado c
             LEFT JOIN seto_setor s ON s.seto_id = c.cham_seto_id
             LEFT JOIN coka_kanban_coluna k ON k.coka_id = c.cham_coka_id
             ${where}
             ORDER BY c.cham_criado_em DESC`,
            params
        );
    }

    public async buscarPorId(id: number, usuarioLogado: UsuarioLogado): Promise<Chamado | null> {
        const chamado = await db.oneOrNone<Chamado>(
            `SELECT c.cham_id         AS id,
                    c.cham_titulo     AS titulo,
                    c.cham_descricao  AS descricao,
                    c.cham_prioridade AS prioridade,
                    c.cham_usua_email AS usua_email,
                    c.cham_func_email AS func_email,
                    c.cham_seto_id    AS seto_id,
                    s.seto_nome       AS setor_nome,
                    c.cham_coka_id    AS coka_id,
                    k.coka_titulo     AS coluna_titulo,
                    c.cham_criado_em  AS criado_em,
                    c.cham_atualizado_em AS atualizado_em
             FROM cham_chamado c
             LEFT JOIN seto_setor s ON s.seto_id = c.cham_seto_id
             LEFT JOIN coka_kanban_coluna k ON k.coka_id = c.cham_coka_id
             WHERE c.cham_id = $1`,
            [id]
        );

        if (!chamado) return null;

        // Verifica acesso
        if (usuarioLogado.tipo === 4 && chamado.usua_email !== usuarioLogado.email) return null;
        if (usuarioLogado.tipo === 3 && usuarioLogado.seto_id && chamado.seto_id !== usuarioLogado.seto_id) return null;

        const anexos = await db.any<Anexo>(
            `SELECT anex_id AS id, anex_cham_id AS cham_id, anex_nome AS nome,
                    anex_url AS url, anex_criado_em AS criado_em
             FROM anex_anexo WHERE anex_cham_id = $1`,
            [id]
        );

        return { ...chamado, anexos };
    }

    // Estado mínimo para comparação antes de atualizar (sem filtro de visibilidade)
    public async buscarEstadoSimples(id: number): Promise<{ coka_id?: number; func_email?: string; seto_id?: number; usua_email?: string; titulo: string } | null> {
        return db.oneOrNone(
            `SELECT cham_coka_id   AS coka_id,
                    cham_func_email AS func_email,
                    cham_seto_id    AS seto_id,
                    cham_usua_email AS usua_email,
                    cham_titulo     AS titulo
             FROM cham_chamado WHERE cham_id = $1`,
            [id]
        );
    }

    public async atualizar(id: number, dados: Partial<Pick<Chamado, 'titulo' | 'descricao' | 'seto_id' | 'prioridade' | 'func_email' | 'coka_id'>>): Promise<Chamado | null> {
        const sets: string[] = [];
        const params: any[] = [];
        let p = 1;

        if (dados.titulo !== undefined)      { sets.push(`cham_titulo = $${p++}`);     params.push(dados.titulo); }
        if (dados.descricao !== undefined)   { sets.push(`cham_descricao = $${p++}`);  params.push(dados.descricao); }
        if (dados.seto_id !== undefined)     { sets.push(`cham_seto_id = $${p++}`);    params.push(dados.seto_id); }
        if (dados.prioridade !== undefined)  { sets.push(`cham_prioridade = $${p++}`); params.push(dados.prioridade); }
        if (dados.func_email !== undefined)  { sets.push(`cham_func_email = $${p++}`); params.push(dados.func_email); }
        if (dados.coka_id !== undefined)     { sets.push(`cham_coka_id = $${p++}`);    params.push(dados.coka_id); }

        if (!sets.length) throw new Error('Nenhum campo para atualizar');

        sets.push(`cham_atualizado_em = NOW()`);
        params.push(id);

        await db.none(
            `UPDATE cham_chamado SET ${sets.join(', ')} WHERE cham_id = $${p}`,
            params
        );

        return db.oneOrNone<Chamado>(
            `SELECT c.cham_id         AS id,
                    c.cham_titulo     AS titulo,
                    c.cham_descricao  AS descricao,
                    c.cham_prioridade AS prioridade,
                    c.cham_usua_email AS usua_email,
                    c.cham_func_email AS func_email,
                    c.cham_seto_id    AS seto_id,
                    s.seto_nome       AS setor_nome,
                    c.cham_coka_id    AS coka_id,
                    k.coka_titulo     AS coluna_titulo,
                    c.cham_criado_em  AS criado_em,
                    c.cham_atualizado_em AS atualizado_em
             FROM cham_chamado c
             LEFT JOIN seto_setor s ON s.seto_id = c.cham_seto_id
             LEFT JOIN coka_kanban_coluna k ON k.coka_id = c.cham_coka_id
             WHERE c.cham_id = $1`,
            [id]
        );
    }
}
