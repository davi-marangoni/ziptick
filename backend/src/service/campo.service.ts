import db from '../db/database';

export interface CampoCustomizado {
    id: number;
    label: string;
    tipo: 'texto' | 'numero' | 'data' | 'select' | 'checkbox';
    obrigatorio: boolean;
    seto_id?: number;
    setor_nome?: string;
    ordem: number;
    opcoes?: string; // JSON string para tipo=select
    criado_em?: Date;
}

export class CampoService {

    public async listarPorSetor(seto_id: number): Promise<CampoCustomizado[]> {
        return db.any<CampoCustomizado>(
            `SELECT c.cacu_id AS id, c.cacu_label AS label, c.cacu_tipo AS tipo,
                    c.cacu_obrigatorio AS obrigatorio, c.cacu_seto_id AS seto_id,
                    s.seto_nome AS setor_nome, c.cacu_ordem AS ordem,
                    c.cacu_opcoes AS opcoes, c.cacu_criado_em AS criado_em
             FROM cacu_campo_customizado c
             LEFT JOIN seto_setor s ON s.seto_id = c.cacu_seto_id
             WHERE c.cacu_seto_id = $1
             ORDER BY c.cacu_ordem, c.cacu_id`,
            [seto_id]
        );
    }

    public async criar(dados: Omit<CampoCustomizado, 'id' | 'criado_em' | 'setor_nome'>): Promise<CampoCustomizado> {
        return db.one<CampoCustomizado>(
            `INSERT INTO cacu_campo_customizado
                (cacu_label, cacu_tipo, cacu_obrigatorio, cacu_seto_id, cacu_ordem, cacu_opcoes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING cacu_id AS id, cacu_label AS label, cacu_tipo AS tipo,
                       cacu_obrigatorio AS obrigatorio, cacu_seto_id AS seto_id,
                       cacu_ordem AS ordem, cacu_opcoes AS opcoes`,
            [dados.label, dados.tipo, dados.obrigatorio, dados.seto_id || null, dados.ordem, dados.opcoes || null]
        );
    }

    public async atualizar(id: number, dados: Partial<Omit<CampoCustomizado, 'id' | 'criado_em' | 'setor_nome'>>): Promise<CampoCustomizado> {
        const sets: string[] = [];
        const params: any[] = [];
        let p = 1;

        if (dados.label !== undefined)      { sets.push(`cacu_label = $${p++}`);       params.push(dados.label); }
        if (dados.tipo !== undefined)       { sets.push(`cacu_tipo = $${p++}`);        params.push(dados.tipo); }
        if (dados.obrigatorio !== undefined){ sets.push(`cacu_obrigatorio = $${p++}`); params.push(dados.obrigatorio); }
        if (dados.seto_id !== undefined)    { sets.push(`cacu_seto_id = $${p++}`);     params.push(dados.seto_id); }
        if (dados.ordem !== undefined)      { sets.push(`cacu_ordem = $${p++}`);       params.push(dados.ordem); }
        if (dados.opcoes !== undefined)     { sets.push(`cacu_opcoes = $${p++}`);      params.push(dados.opcoes); }

        if (!sets.length) throw new Error('Nenhum campo para atualizar');

        params.push(id);
        return db.one<CampoCustomizado>(
            `UPDATE cacu_campo_customizado SET ${sets.join(', ')} WHERE cacu_id = $${p}
             RETURNING cacu_id AS id, cacu_label AS label, cacu_tipo AS tipo,
                       cacu_obrigatorio AS obrigatorio, cacu_seto_id AS seto_id,
                       cacu_ordem AS ordem, cacu_opcoes AS opcoes`,
            params
        );
    }

    public async deletar(id: number): Promise<void> {
        await db.none('DELETE FROM cacu_campo_customizado WHERE cacu_id = $1', [id]);
    }

    public async salvarValores(cham_id: number, valores: { cacu_id: number; valor: string }[]): Promise<void> {
        await db.tx(async t => {
            await t.batch(valores.map(v =>
                t.none(
                    `INSERT INTO cacv_campo_valor (cacv_cham_id, cacv_cacu_id, cacv_valor)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (cacv_cham_id, cacv_cacu_id) DO UPDATE SET cacv_valor = $3`,
                    [cham_id, v.cacu_id, v.valor]
                )
            ));
        });
    }

    public async buscarValores(cham_id: number): Promise<{ cacu_id: number; label: string; valor: string }[]> {
        return db.any(
            `SELECT v.cacv_cacu_id AS cacu_id, c.cacu_label AS label, v.cacv_valor AS valor
             FROM cacv_campo_valor v
             JOIN cacu_campo_customizado c ON c.cacu_id = v.cacv_cacu_id
             WHERE v.cacv_cham_id = $1`,
            [cham_id]
        );
    }
}
