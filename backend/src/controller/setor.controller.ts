import { Request, Response } from 'express';
import { SetorService } from '../service/setor.service';
import { LogService } from '../service/log.service';

export class SetorController {
    private setorService: SetorService;
    private logService: LogService;

    constructor() {
        this.setorService = new SetorService();
        this.logService = new LogService();
    }

    private clientIp(req: Request): string | undefined {
        if (!req.ip) return undefined;
        if (Array.isArray(req.ip)) return req.ip[0];
        return req.ip;
    }

    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const setores = await this.setorService.listar();
            res.status(200).json({ success: true, data: setores });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao listar setores: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            const { nome, cor } = req.body;
            if (!nome?.trim()) {
                res.status(400).json({ success: false, message: 'Nome do setor é obrigatório' });
                return;
            }

            const setor = await this.setorService.criar(nome, cor);
            await this.logService.registrar(
                req.emailUsuario || null,
                'CRIAR_SETOR',
                `Setor "${nome}" criado`,
                this.clientIp(req)
            );
            res.status(201).json({ success: true, data: setor, message: 'Setor criado com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(msg === 'Setor já cadastrado' ? 409 : 500).json({ success: false, message: msg });
        }
    }

    public async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            const { nome, cor } = req.body;

            if (!nome?.trim()) {
                res.status(400).json({ success: false, message: 'Nome do setor é obrigatório' });
                return;
            }

            const setor = await this.setorService.atualizar(id, nome, cor);
            await this.logService.registrar(
                req.emailUsuario || null,
                'ATUALIZAR_SETOR',
                `Setor ${id} renomeado para "${nome}"`,
                this.clientIp(req)
            );
            res.status(200).json({ success: true, data: setor, message: 'Setor atualizado com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            const status = msg === 'Setor não encontrado' ? 404 : msg === 'Setor já cadastrado' ? 409 : 500;
            res.status(status).json({ success: false, message: msg });
        }
    }

    public async deletar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            await this.setorService.deletar(id);
            await this.logService.registrar(
                req.emailUsuario || null,
                'DELETAR_SETOR',
                `Setor ${id} removido`,
                this.clientIp(req)
            );
            res.status(200).json({ success: true, message: 'Setor removido com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(msg === 'Setor não encontrado' ? 404 : 500).json({ success: false, message: msg });
        }
    }
}
