import { Request, Response } from 'express';
import { CampoService } from '../service/campo.service';

export class CampoController {
    private campoService: CampoService;

    constructor() {
        this.campoService = new CampoService();
    }

    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const seto_id = req.query['seto_id'] ? parseInt(req.query['seto_id'] as string, 10) : 0;
            if (!seto_id) {
                res.status(400).json({ success: false, message: 'Parâmetro seto_id é obrigatório' });
                return;
            }
            const campos = await this.campoService.listarPorSetor(seto_id);
            res.status(200).json({ success: true, data: campos });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao listar campos: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            const { label, tipo, obrigatorio, seto_id, ordem, opcoes } = req.body;
            if (!label || !tipo || !seto_id) {
                res.status(400).json({ success: false, message: 'label, tipo e seto_id são obrigatórios' });
                return;
            }
            const campo = await this.campoService.criar({
                label, tipo, obrigatorio: !!obrigatorio,
                seto_id: parseInt(seto_id, 10),
                ordem: ordem || 0,
                opcoes: opcoes ? JSON.stringify(opcoes) : undefined
            });
            res.status(201).json({ success: true, data: campo, message: 'Campo criado' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao criar campo: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            const campo = await this.campoService.atualizar(id, req.body);
            res.status(200).json({ success: true, data: campo, message: 'Campo atualizado' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao atualizar campo: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async deletar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            await this.campoService.deletar(id);
            res.status(200).json({ success: true, message: 'Campo removido' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao remover campo: ${error instanceof Error ? error.message : error}` });
        }
    }
}
