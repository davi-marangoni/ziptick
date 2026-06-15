import { Request, Response } from 'express';
import { NotificacaoService } from '../service/notificacao.service';

export class NotificacaoController {
    private notificacaoService: NotificacaoService;

    constructor() {
        this.notificacaoService = new NotificacaoService();
    }

    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const notificacoes = await this.notificacaoService.listar(req.emailUsuario!);
            res.status(200).json({ success: true, data: notificacoes });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao listar notificações: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async marcarLida(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            await this.notificacaoService.marcarLida(id, req.emailUsuario!);
            res.status(200).json({ success: true, message: 'Notificação marcada como lida' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async marcarTodasLidas(req: Request, res: Response): Promise<void> {
        try {
            await this.notificacaoService.marcarTodasLidas(req.emailUsuario!);
            res.status(200).json({ success: true, message: 'Todas marcadas como lidas' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro: ${error instanceof Error ? error.message : error}` });
        }
    }
}
