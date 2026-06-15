import { Request, Response } from 'express';
import { KanbanService } from '../service/kanban.service';
import { LogService } from '../service/log.service';

export class KanbanController {
    private kanbanService: KanbanService;
    private logService: LogService;

    constructor() {
        this.kanbanService = new KanbanService();
        this.logService = new LogService();
    }

    private clientIp(req: Request): string | undefined {
        if (!req.ip) return undefined;
        if (Array.isArray(req.ip)) return req.ip[0];
        return req.ip;
    }

    public async listarColunas(req: Request, res: Response): Promise<void> {
        try {
            const seto_id = req.query['seto_id'] ? parseInt(req.query['seto_id'] as string, 10) : undefined;
            const all = req.query['all'] === 'true';
            const colunas = await this.kanbanService.listarColunas(seto_id, all);
            res.status(200).json({ success: true, data: colunas });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao listar colunas: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async criarColuna(req: Request, res: Response): Promise<void> {
        try {
            const { titulo, ordem, seto_id } = req.body;
            if (!titulo?.trim()) {
                res.status(400).json({ success: false, message: 'Título é obrigatório' });
                return;
            }
            const coluna = await this.kanbanService.criarColuna(
                titulo, ordem || 99, seto_id ? parseInt(seto_id, 10) : undefined
            );
            await this.logService.registrar(req.emailUsuario || null, 'CRIAR_COLUNA_KANBAN', `Coluna "${titulo}" criada`, this.clientIp(req));
            res.status(201).json({ success: true, data: coluna, message: 'Coluna criada com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao criar coluna: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async atualizarColuna(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            const { titulo, ordem, seto_id } = req.body;
            const coluna = await this.kanbanService.atualizarColuna(id, {
                titulo, ordem,
                ...(seto_id !== undefined && { seto_id: seto_id ? parseInt(seto_id, 10) : null })
            });
            res.status(200).json({ success: true, data: coluna, message: 'Coluna atualizada' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ success: false, message: msg });
        }
    }

    public async deletarColuna(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            await this.kanbanService.deletarColuna(id);
            await this.logService.registrar(req.emailUsuario || null, 'DELETAR_COLUNA_KANBAN', `Coluna ${id} removida`, this.clientIp(req));
            res.status(200).json({ success: true, message: 'Coluna removida com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(msg === 'Coluna não encontrada' ? 404 : 500).json({ success: false, message: msg });
        }
    }

    public async reordenarColunas(req: Request, res: Response): Promise<void> {
        try {
            const { ordens } = req.body;
            if (!Array.isArray(ordens)) {
                res.status(400).json({ success: false, message: 'Campo ordens deve ser um array [{id, ordem}]' });
                return;
            }
            await this.kanbanService.reordenarColunas(ordens);
            res.status(200).json({ success: true, message: 'Ordem atualizada' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao reordenar: ${error instanceof Error ? error.message : error}` });
        }
    }
}
