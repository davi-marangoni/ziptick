import db from '../db/database';
import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';

export interface Notificacao {
    id: number;
    usua_email: string;
    cham_id?: number;
    mensagem: string;
    tipo: string;
    lida: boolean;
    criado_em?: Date;
}

export class NotificacaoService {
    private bot: TelegramBot | null = null;

    constructor() {
        if (process.env.TELEGRAM_BOT_TOKEN) {
            this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
        }
    }

    public async listar(usua_email: string): Promise<Notificacao[]> {
        return db.any<Notificacao>(
            `SELECT noti_id AS id, noti_usua_email AS usua_email,
                    noti_cham_id AS cham_id, noti_mensagem AS mensagem,
                    noti_tipo AS tipo, noti_lida AS lida, noti_criado_em AS criado_em
             FROM noti_notificacao
             WHERE noti_usua_email = $1
             ORDER BY noti_criado_em DESC
             LIMIT 50`,
            [usua_email]
        );
    }

    public async marcarLida(id: number, usua_email: string): Promise<void> {
        await db.none(
            'UPDATE noti_notificacao SET noti_lida = TRUE WHERE noti_id = $1 AND noti_usua_email = $2',
            [id, usua_email]
        );
    }

    public async marcarTodasLidas(usua_email: string): Promise<void> {
        await db.none(
            'UPDATE noti_notificacao SET noti_lida = TRUE WHERE noti_usua_email = $1',
            [usua_email]
        );
    }

    public async enviarInterna(usua_email: string, mensagem: string, cham_id?: number): Promise<void> {
        try {
            await db.none(
                `INSERT INTO noti_notificacao (noti_usua_email, noti_cham_id, noti_mensagem, noti_tipo)
                 VALUES ($1, $2, $3, 'interna')`,
                [usua_email, cham_id || null, mensagem]
            );
        } catch (error) {
            console.error('[NotificacaoService] Erro ao criar notificação interna:', error);
        }
    }

    public async enviarEmail(para: string, assunto: string, corpo: string): Promise<void> {
        if (!process.env.SMTP_HOST) {
            console.log(`[Email] Para: ${para} | ${assunto}\n${corpo}`);
            return;
        }
        try {
            const transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
            await transport.sendMail({ from: process.env.SMTP_USER, to: para, subject: assunto, html: corpo });
        } catch (error) {
            console.error('[NotificacaoService] Erro ao enviar e-mail:', error);
        }
    }

    public async enviarTelegram(telegram_id: string, mensagem: string): Promise<void> {
        if (!this.bot) return;
        try {
            await this.bot.sendMessage(telegram_id, mensagem);
        } catch (error) {
            console.error('[NotificacaoService] Erro Telegram:', error);
        }
    }

    public async notificarAberturaChamado(cham_id: number, titulo: string, setor_id?: number): Promise<void> {
        try {
            // Notifica admin
            const admins = await db.any<{ usua_email: string; usua_telegram_id?: string }>(
                `SELECT usua_email, usua_telegram_id FROM usua_usuario WHERE usua_tipo_usuario = 1`
            );
            for (const admin of admins) {
                await this.enviarInterna(admin.usua_email, `Novo chamado #${cham_id}: "${titulo}"`, cham_id);
                await this.enviarEmail(admin.usua_email, `[ZipTick] Novo chamado #${cham_id}`, `<p>Novo chamado aberto: <strong>${titulo}</strong> (ID: ${cham_id})</p>`);
                if (admin.usua_telegram_id) {
                    await this.enviarTelegram(admin.usua_telegram_id, `🎫 Novo chamado #${cham_id}: "${titulo}"`);
                }
            }

            // Notifica gerência do setor
            if (setor_id) {
                const gerentes = await db.any<{ usua_email: string; usua_telegram_id?: string }>(
                    `SELECT usua_email, usua_telegram_id FROM usua_usuario WHERE usua_tipo_usuario = 2 AND usua_seto_id = $1`,
                    [setor_id]
                );
                for (const g of gerentes) {
                    await this.enviarInterna(g.usua_email, `Novo chamado #${cham_id} no seu setor: "${titulo}"`, cham_id);
                    if (g.usua_telegram_id) {
                        await this.enviarTelegram(g.usua_telegram_id, `🎫 Novo chamado #${cham_id} no seu setor: "${titulo}"`);
                    }
                }
            }
        } catch (error) {
            console.error('[NotificacaoService] Erro ao notificar abertura:', error);
        }
    }

    public async notificarConclusaoChamado(cham_id: number, titulo: string, usua_email: string): Promise<void> {
        try {
            await this.enviarInterna(usua_email, `Seu chamado #${cham_id} foi concluído: "${titulo}"`, cham_id);
            await this.enviarEmail(usua_email, `[ZipTick] Chamado #${cham_id} concluído`, `<p>Seu chamado <strong>${titulo}</strong> (ID: ${cham_id}) foi marcado como concluído.</p>`);

            const usuario = await db.oneOrNone<{ usua_telegram_id?: string; usua_whatsapp?: string }>(
                'SELECT usua_telegram_id, usua_whatsapp FROM usua_usuario WHERE usua_email = $1',
                [usua_email]
            );
            if (usuario?.usua_telegram_id) {
                await this.enviarTelegram(usuario.usua_telegram_id, `✅ Chamado #${cham_id} concluído: "${titulo}"`);
            }
        } catch (error) {
            console.error('[NotificacaoService] Erro ao notificar conclusão:', error);
        }
    }

    public async notificarAtribuicao(cham_id: number, titulo: string, func_email: string): Promise<void> {
        try {
            await this.enviarInterna(func_email, `Chamado #${cham_id} atribuído a você: "${titulo}"`, cham_id);
            await this.enviarEmail(func_email, `[ZipTick] Chamado atribuído a você`, `<p>O chamado <strong>${titulo}</strong> (ID: ${cham_id}) foi atribuído a você.</p>`);

            const usuario = await db.oneOrNone<{ usua_telegram_id?: string }>(
                'SELECT usua_telegram_id FROM usua_usuario WHERE usua_email = $1',
                [func_email]
            );
            if (usuario?.usua_telegram_id) {
                await this.enviarTelegram(usuario.usua_telegram_id, `📋 Chamado #${cham_id} atribuído a você: "${titulo}"`);
            }
        } catch (error) {
            console.error('[NotificacaoService] Erro ao notificar atribuição:', error);
        }
    }
}
