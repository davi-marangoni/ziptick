import db from '../db/database';
import { Setor } from '../interface/setor';

const SELECT = `SELECT seto_id AS id, seto_nome AS nome, seto_cor AS cor, seto_criado_em AS criado_em FROM seto_setor`;

export class SetorService {

    public async listar(): Promise<Setor[]> {
        return db.any(`${SELECT} ORDER BY seto_nome`);
    }

    public async buscarPorId(id: number): Promise<Setor | null> {
        return db.oneOrNone(`${SELECT} WHERE seto_id = $1`, [id]);
    }

    public async criar(nome: string, cor?: string): Promise<Setor> {
        try {
            return await db.one(
                `INSERT INTO seto_setor (seto_nome, seto_cor)
                 VALUES ($1, $2)
                 RETURNING seto_id AS id, seto_nome AS nome, seto_cor AS cor, seto_criado_em AS criado_em`,
                [nome.trim(), cor || '#6b7280']
            );
        } catch (error: any) {
            if (error?.code === '23505') throw new Error('Setor já cadastrado');
            throw error;
        }
    }

    public async atualizar(id: number, nome: string, cor?: string): Promise<Setor> {
        const existente = await this.buscarPorId(id);
        if (!existente) throw new Error('Setor não encontrado');

        try {
            return await db.one(
                `UPDATE seto_setor
                 SET seto_nome = $1, seto_cor = COALESCE($2, seto_cor)
                 WHERE seto_id = $3
                 RETURNING seto_id AS id, seto_nome AS nome, seto_cor AS cor`,
                [nome.trim(), cor || null, id]
            );
        } catch (error: any) {
            if (error?.code === '23505') throw new Error('Setor já cadastrado');
            throw error;
        }
    }

    public async deletar(id: number): Promise<void> {
        const existente = await this.buscarPorId(id);
        if (!existente) throw new Error('Setor não encontrado');
        await db.none('DELETE FROM seto_setor WHERE seto_id = $1', [id]);
    }
}
