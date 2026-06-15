import { Request, Response } from 'express';
import { ChamadoService } from '../service/chamado.service';
import { LogService } from '../service/log.service';
import { NotificacaoService } from '../service/notificacao.service';

export class ChamadoController {
    private chamadoService: ChamadoService;
    private logService: LogService;
    private notificacaoService: NotificacaoService;

    constructor() {
        this.chamadoService = new ChamadoService();
        this.logService = new LogService();
        this.notificacaoService = new NotificacaoService();
    }

    private clientIp(req: Request): string | undefined {
        if (!req.ip) return undefined;
        if (Array.isArray(req.ip)) return req.ip[0];
        return req.ip;
    }

    private usuarioLogado(req: Request) {
        return {
            email: req.emailUsuario!,
            tipo: req.tipoUsuario!,
            seto_id: (req.user as any)?.seto_id,
        };
    }

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            const { titulo, descricao, seto_id } = req.body;
            if (!titulo?.trim()) {
                res.status(400).json({ success: false, message: 'Título é obrigatório' });
                return;
            }

            const files = (req.files as Express.Multer.File[]) || [];
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const anexos = files.map(f => ({
                nome: f.originalname,
                url: `${baseUrl}/uploads/${f.filename}`
            }));

            const chamado = await this.chamadoService.criar({
                titulo,
                descricao,
                seto_id: seto_id ? parseInt(seto_id, 10) : undefined,
                usuarioLogado: this.usuarioLogado(req),
                ip: this.clientIp(req),
                anexos
            });

            await this.logService.registrar(
                req.emailUsuario || null,
                'CRIAR_CHAMADO',
                `Chamado #${chamado.id} criado: "${titulo}"`,
                this.clientIp(req)
            );

            res.status(201).json({ success: true, data: chamado, message: 'Chamado aberto com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao criar chamado: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const filtros = {
                seto_id: req.query['seto_id'] ? parseInt(req.query['seto_id'] as string, 10) : undefined,
                coka_id: req.query['coka_id'] ? parseInt(req.query['coka_id'] as string, 10) : undefined,
            };
            const chamados = await this.chamadoService.listar(this.usuarioLogado(req), filtros);
            res.status(200).json({ success: true, data: chamados });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao listar chamados: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            const chamado = await this.chamadoService.buscarPorId(id, this.usuarioLogado(req));
            if (!chamado) {
                res.status(404).json({ success: false, message: 'Chamado não encontrado' });
                return;
            }
            res.status(200).json({ success: true, data: chamado });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao buscar chamado: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params['id'] as string, 10);
            const { titulo, descricao, seto_id, prioridade, func_email, coka_id } = req.body;

            // Captura estado anterior para comparar e gerar notificações
            const antes = await this.chamadoService.buscarEstadoSimples(id);

            const dados = {
                titulo, descricao,
                seto_id: seto_id !== undefined ? parseInt(seto_id, 10) : undefined,
                prioridade: prioridade !== undefined ? parseInt(prioridade, 10) : undefined,
                func_email: func_email || undefined,
                coka_id: coka_id !== undefined ? parseInt(coka_id, 10) : undefined,
            };

            const chamado = await this.chamadoService.atualizar(id, dados);

            if (!chamado) {
                res.status(404).json({ success: false, message: 'Chamado não encontrado' });
                return;
            }

            // Notificações assíncronas (não bloqueia a resposta)
            if (antes) {
                const proprietario = antes.usua_email;

                // Coluna/status mudou
                if (dados.coka_id !== undefined && dados.coka_id !== antes.coka_id && proprietario) {
                    this.notificacaoService.enviarInterna(
                        proprietario,
                        `Seu chamado #${id} ("${chamado.titulo}") foi movido para "${chamado.coluna_titulo ?? 'nova coluna'}".`,
                        id
                    );
                }

                // Setor mudou
                if (dados.seto_id !== undefined && dados.seto_id !== antes.seto_id && proprietario) {
                    this.notificacaoService.enviarInterna(
                        proprietario,
                        `Seu chamado #${id} ("${chamado.titulo}") foi transferido para o setor "${chamado.setor_nome ?? 'novo setor'}".`,
                        id
                    );
                }

                // Responsável atribuído ou alterado
                if (dados.func_email && dados.func_email !== antes.func_email) {
                    this.notificacaoService.enviarInterna(
                        dados.func_email,
                        `Você foi designado(a) responsável pelo chamado #${id}: "${chamado.titulo}".`,
                        id
                    );
                }
            }

            await this.logService.registrar(
                req.emailUsuario || null,
                'ATUALIZAR_CHAMADO',
                `Chamado #${id} atualizado`,
                this.clientIp(req)
            );

            res.status(200).json({ success: true, data: chamado, message: 'Chamado atualizado' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao atualizar chamado: ${error instanceof Error ? error.message : error}` });
        }
    }
}
