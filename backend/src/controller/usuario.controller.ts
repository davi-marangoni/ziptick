import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../service/auth.service';
import { LogService } from '../service/log.service';

export class UsuarioController {
    private usuarioService: UsuarioService;
    private authService: AuthService;
    private logService: LogService;

    constructor() {
        this.usuarioService = new UsuarioService();
        this.authService = new AuthService();
        this.logService = new LogService();
    }

    private clientIp(req: Request): string | undefined {
        if (!req.ip) return undefined;
        if (Array.isArray(req.ip)) return req.ip[0];
        return req.ip;
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
                return;
            }

            const resultado = await this.authService.login(email, senha);

            if (!resultado) {
                res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
                return;
            }

            await this.logService.registrar(email, 'LOGIN', 'Login realizado com sucesso', this.clientIp(req));

            res.status(200).json({ success: true, data: resultado, message: 'Login realizado com sucesso' });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    public async getUsuarios(_req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await this.usuarioService.getUsuarios();
            res.status(200).json({ success: true, data: usuarios, message: 'Usuários encontrados com sucesso' });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao buscar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    public async getUsuarioByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params['email'] as string;
            if (!email) {
                res.status(400).json({ success: false, message: 'Email é obrigatório' });
                return;
            }

            const usuario = await this.usuarioService.getUsuarioByEmail(email);
            if (!usuario) {
                res.status(404).json({ success: false, message: 'Usuário não encontrado' });
                return;
            }

            const { senha: _, ...usuarioResponse } = usuario;
            res.status(200).json({ success: true, data: usuarioResponse, message: 'Usuário encontrado com sucesso' });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao buscar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    public async registerPublico(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha, nome, aceitou_termos } = req.body;

            if (!email || !senha || !nome) {
                res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
                return;
            }
            if (!aceitou_termos) {
                res.status(400).json({ success: false, message: 'É necessário aceitar os termos de uso' });
                return;
            }
            if (senha.length < 6) {
                res.status(400).json({ success: false, message: 'Senha deve ter pelo menos 6 caracteres' });
                return;
            }

            const usuario = await this.usuarioService.createUsuarioPublico({
                email,
                senha,
                nome,
                aceitou_termos,
                ip_criacao: this.clientIp(req)
            });

            await this.logService.registrar(null, 'CADASTRO_PUBLICO', `Cadastro público: ${email}`, this.clientIp(req));

            res.status(201).json({ success: true, data: usuario, message: 'Cadastro realizado com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(msg === 'Email já cadastrado no sistema' ? 409 : 500).json({ success: false, message: msg });
        }
    }

    public async createUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha, tipo, nome } = req.body;

            if (!email || !senha || tipo === undefined) {
                res.status(400).json({ success: false, message: 'Email, senha e tipo são obrigatórios' });
                return;
            }

            if (![1, 2, 3, 4].includes(tipo)) {
                res.status(400).json({ success: false, message: 'Tipo inválido (1=Admin, 2=Gerência, 3=Funcionário, 4=Usuário)' });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ success: false, message: 'Email inválido' });
                return;
            }

            if (senha.length < 6) {
                res.status(400).json({ success: false, message: 'Senha deve ter pelo menos 6 caracteres' });
                return;
            }

            const { seto_id, cargo } = req.body;

            const usuario = await this.usuarioService.createUsuario({
                email,
                senha,
                tipo,
                nome,
                ip_criacao: this.clientIp(req),
                seto_id: seto_id ? parseInt(seto_id, 10) : undefined,
                cargo: cargo || undefined
            });

            await this.logService.registrar(
                req.emailUsuario || null,
                'CRIAR_USUARIO',
                `Usuário ${email} (tipo ${tipo}) criado`,
                this.clientIp(req)
            );

            res.status(201).json({ success: true, data: usuario, message: 'Usuário criado com sucesso' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Email já cadastrado no sistema') {
                res.status(409).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }

    public async updatePerfil(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params['email'] as string;
            const { telegram_id, whatsapp } = req.body;

            // Usuário só pode atualizar o próprio perfil (admin pode qualquer um)
            if (req.tipoUsuario !== 1 && req.emailUsuario !== email) {
                res.status(403).json({ success: false, message: 'Sem permissão para editar este perfil' });
                return;
            }

            await this.usuarioService.updatePerfil(email, { telegram_id, whatsapp });
            res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: `Erro ao atualizar perfil: ${error instanceof Error ? error.message : error}` });
        }
    }

    public async updateSenhaUsuario(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params['email'] as string;
            const { novaSenha } = req.body;

            if (!email || !novaSenha) {
                res.status(400).json({ success: false, message: 'Email e nova senha são obrigatórios' });
                return;
            }

            if (novaSenha.length < 6) {
                res.status(400).json({ success: false, message: 'Senha deve ter pelo menos 6 caracteres' });
                return;
            }

            await this.usuarioService.updateSenhaUsuario(email, novaSenha);

            await this.logService.registrar(
                req.emailUsuario || null,
                'ATUALIZAR_SENHA',
                `Senha do usuário ${email} atualizada`,
                this.clientIp(req)
            );

            res.status(200).json({ success: true, message: 'Senha atualizada com sucesso' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuário não encontrado') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao atualizar senha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }

    public async deleteUsuario(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params['email'] as string;
            if (!email) {
                res.status(400).json({ success: false, message: 'Email é obrigatório' });
                return;
            }

            await this.usuarioService.deleteUsuario(email);

            await this.logService.registrar(
                req.emailUsuario || null,
                'DELETAR_USUARIO',
                `Usuário ${email} removido`,
                this.clientIp(req)
            );

            res.status(200).json({ success: true, message: 'Usuário removido com sucesso' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuário não encontrado') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao remover usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }
}
