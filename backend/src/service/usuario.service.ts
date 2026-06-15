import { Usuario } from '../interface/usuario';
import db from '../db/database';
import bcrypt from 'bcryptjs';

export class UsuarioService {

    public async getUsuarios(): Promise<Omit<Usuario, 'senha'>[]> {
        try {
            return await db.any(
                `SELECT u.usua_email         AS email,
                        u.usua_nome          AS nome,
                        u.usua_tipo_usuario  AS tipo,
                        u.usua_cargo         AS cargo,
                        u.usua_criado_em     AS criado_em,
                        s.seto_id            AS seto_id,
                        s.seto_nome          AS setor_nome
                 FROM usua_usuario u
                 LEFT JOIN seto_setor s ON s.seto_id = u.usua_seto_id
                 ORDER BY u.usua_criado_em DESC`
            );
        } catch (error) {
            throw new Error(`Erro ao buscar usuários: ${error}`);
        }
    }

    public async getUsuarioByEmail(email: string): Promise<Usuario | null> {
        try {
            return await db.oneOrNone(
                `SELECT usua_email       AS email,
                        usua_senha       AS senha,
                        usua_nome        AS nome,
                        usua_tipo_usuario AS tipo,
                        usua_ip_criacao  AS ip_criacao,
                        usua_criado_em   AS criado_em,
                        usua_aceitou_termos AS aceitou_termos,
                        usua_seto_id     AS seto_id,
                        usua_cargo       AS cargo
                 FROM usua_usuario WHERE usua_email = $1`,
                [email]
            );
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por email: ${error}`);
        }
    }

    public async createUsuario(dados: Partial<Usuario> & { email: string; senha: string; tipo: number }): Promise<Omit<Usuario, 'senha'>> {
        try {
            const existente = await this.getUsuarioByEmail(dados.email);
            if (existente) throw new Error('Email já cadastrado no sistema');

            const senhaCriptografada = await bcrypt.hash(dados.senha, 12);

            return await db.one(
                `INSERT INTO usua_usuario
                    (usua_email, usua_senha, usua_tipo_usuario, usua_nome, usua_ip_criacao,
                     usua_criado_em, usua_seto_id, usua_cargo)
                 VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
                 RETURNING
                    usua_email       AS email,
                    usua_nome        AS nome,
                    usua_tipo_usuario AS tipo,
                    usua_cargo       AS cargo,
                    usua_criado_em   AS criado_em`,
                [dados.email, senhaCriptografada, dados.tipo, dados.nome || null,
                 dados.ip_criacao || null, dados.seto_id || null, dados.cargo || null]
            );
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Erro ao criar usuário: ${error}`);
        }
    }

    public async createUsuarioPublico(dados: {
        email: string;
        senha: string;
        nome: string;
        aceitou_termos: boolean;
        ip_criacao?: string;
    }): Promise<Omit<Usuario, 'senha'>> {
        if (!dados.aceitou_termos) {
            throw new Error('É necessário aceitar os termos de uso para se cadastrar');
        }

        const existente = await this.getUsuarioByEmail(dados.email);
        if (existente) throw new Error('Email já cadastrado no sistema');

        const senhaCriptografada = await bcrypt.hash(dados.senha, 12);

        return db.one(
            `INSERT INTO usua_usuario
                (usua_email, usua_senha, usua_tipo_usuario, usua_nome,
                 usua_ip_criacao, usua_criado_em, usua_aceitou_termos)
             VALUES ($1, $2, 4, $3, $4, NOW(), TRUE)
             RETURNING
                usua_email        AS email,
                usua_nome         AS nome,
                usua_tipo_usuario AS tipo,
                usua_criado_em    AS criado_em`,
            [dados.email, senhaCriptografada, dados.nome, dados.ip_criacao || null]
        );
    }

    public async updatePerfil(email: string, dados: { telegram_id?: string; whatsapp?: string }): Promise<void> {
        const sets: string[] = [];
        const params: any[] = [];
        let p = 1;
        if (dados.telegram_id !== undefined) { sets.push(`usua_telegram_id = $${p++}`); params.push(dados.telegram_id || null); }
        if (dados.whatsapp !== undefined)    { sets.push(`usua_whatsapp = $${p++}`);     params.push(dados.whatsapp || null); }
        if (!sets.length) return;
        params.push(email);
        await db.none(`UPDATE usua_usuario SET ${sets.join(', ')} WHERE usua_email = $${p}`, params);
    }

    public async updateSenhaUsuario(email: string, novaSenha: string): Promise<void> {
        try {
            const existente = await this.getUsuarioByEmail(email);
            if (!existente) throw new Error('Usuário não encontrado');

            const senhaCriptografada = await bcrypt.hash(novaSenha, 12);
            await db.none(
                'UPDATE usua_usuario SET usua_senha = $1 WHERE usua_email = $2',
                [senhaCriptografada, email]
            );
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Erro ao atualizar senha: ${error}`);
        }
    }

    public async deleteUsuario(email: string): Promise<void> {
        try {
            const existente = await this.getUsuarioByEmail(email);
            if (!existente) throw new Error('Usuário não encontrado');

            await db.none('DELETE FROM usua_usuario WHERE usua_email = $1', [email]);
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Erro ao deletar usuário: ${error}`);
        }
    }
}
