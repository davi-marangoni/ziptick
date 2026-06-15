import db from '../db/database';

export class LogService {
    public async registrar(
        email: string | null,
        acao: string,
        descricao: string,
        ip?: string
    ): Promise<void> {
        try {
            await db.none(
                'INSERT INTO log_acao (log_usua_email, log_acao, log_descricao, log_ip) VALUES ($1, $2, $3, $4)',
                [email, acao, descricao, ip || null]
            );
        } catch (error) {
            // Log nunca deve interromper a operação principal
            console.error(`[LogService] Erro ao registrar log: ${error}`);
        }
    }
}
