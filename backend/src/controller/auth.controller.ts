import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async solicitarResetSenha(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, message: 'Email é obrigatório' });
                return;
            }

            await this.authService.solicitarResetSenha(email);

            // Resposta genérica: não revela se o e-mail existe no sistema
            res.status(200).json({
                success: true,
                message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao processar solicitação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    public async redefinirSenha(req: Request, res: Response): Promise<void> {
        try {
            const { token, novaSenha } = req.body;

            if (!token || !novaSenha) {
                res.status(400).json({ success: false, message: 'Token e nova senha são obrigatórios' });
                return;
            }

            if (novaSenha.length < 6) {
                res.status(400).json({ success: false, message: 'Senha deve ter pelo menos 6 caracteres' });
                return;
            }

            await this.authService.redefinirSenha(token, novaSenha);

            res.status(200).json({ success: true, message: 'Senha redefinida com sucesso' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            const status = msg === 'Token inválido ou expirado' ? 400 : 500;
            res.status(status).json({ success: false, message: msg });
        }
    }
}
