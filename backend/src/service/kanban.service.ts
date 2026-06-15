import db from '../db/database';
import { KanbanColuna } from '../interface/kanban';

export class KanbanService {

    public async listarColunas(seto_id?: number, all?: boolean): Promise<KanbanColuna[]> {
        const select = `
            SELECT k.coka_id        AS id,
                   k.coka_titulo    AS titulo,
                   k.coka_ordem     AS ordem,
                   k.coka_seto_id   AS seto_id,
                   s.seto_nome      AS setor_nome,
                   k.coka_criado_em AS criado_em
            FROM coka_kanban_coluna k
            LEFT JOIN seto_setor s ON s.seto_id = k.coka_seto_id`;

        if (all) {
            // Admin: todas as colunas de todos os setores
            return db.any<KanbanColuna>(
                `${select} ORDER BY k.coka_seto_id NULLS FIRST, k.coka_ordem, k.coka_id`
            );
        }

        // Funcionário/Gerência: globais + do setor específico
        return db.any<KanbanColuna>(
            `${select}
             WHERE k.coka_seto_id IS NULL
                OR k.coka_seto_id = $1
             ORDER BY k.coka_ordem, k.coka_id`,
            [seto_id || null]
        );
    }

    public async criarColuna(titulo: string, ordem: number, seto_id?: number): Promise<KanbanColuna> {
        return db.one<KanbanColuna>(
            `INSERT INTO coka_kanban_coluna (coka_titulo, coka_ordem, coka_seto_id)
             VALUES ($1, $2, $3)
             RETURNING coka_id AS id, coka_titulo AS titulo, coka_ordem AS ordem, coka_seto_id AS seto_id`,
            [titulo, ordem, seto_id || null]
        );
    }

    public async atualizarColuna(id: number, dados: { titulo?: string; ordem?: number; seto_id?: number | null }): Promise<KanbanColuna> {
        const sets: string[] = [];
        const params: any[] = [];
        let p = 1;

        if (dados.titulo !== undefined)  { sets.push(`coka_titulo = $${p++}`);  params.push(dados.titulo); }
        if (dados.ordem !== undefined)   { sets.push(`coka_ordem = $${p++}`);   params.push(dados.ordem); }
        if ('seto_id' in dados)          { sets.push(`coka_seto_id = $${p++}`); params.push(dados.seto_id ?? null); }

        if (!sets.length) throw new Error('Nenhum campo para atualizar');

        params.push(id);
        return db.one<KanbanColuna>(
            `UPDATE coka_kanban_coluna SET ${sets.join(', ')} WHERE coka_id = $${p}
             RETURNING coka_id AS id, coka_titulo AS titulo, coka_ordem AS ordem, coka_seto_id AS seto_id`,
            params
        );
    }

    public async deletarColuna(id: number): Promise<void> {
        const existente = await db.oneOrNone('SELECT coka_id FROM coka_kanban_coluna WHERE coka_id = $1', [id]);
        if (!existente) throw new Error('Coluna não encontrada');
        // Move chamados da coluna para NULL antes de deletar
        await db.none('UPDATE cham_chamado SET cham_coka_id = NULL WHERE cham_coka_id = $1', [id]);
        await db.none('DELETE FROM coka_kanban_coluna WHERE coka_id = $1', [id]);
    }

    public async reordenarColunas(ordens: { id: number; ordem: number }[]): Promise<void> {
        await db.tx(async t => {
            await t.batch(ordens.map(o =>
                t.none('UPDATE coka_kanban_coluna SET coka_ordem = $1 WHERE coka_id = $2', [o.ordem, o.id])
            ));
        });
    }
}
