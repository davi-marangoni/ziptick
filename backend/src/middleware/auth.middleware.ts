import { Request, Response, NextFunction } from 'express';
import passport = require('../config/passport.config');
import { Usuario } from '../interface/usuario';

declare global {
    namespace Express {
        interface User extends Omit<Usuario, 'senha'> {}
        interface Request {
            emailUsuario?: string;
            tipoUsuario?: number;
        }
    }
}

export class AuthMiddleware {
    /**
     * Middleware para verificar autenticação via JWT usando Passport
     */
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate('jwt', { session: false }, (error: any, user: Express.User | false) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: `Erro interno ao validar token: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
            if (!user) {
                return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
            }
            req.user = user;
            req.emailUsuario = user.email;
            req.tipoUsuario = user.tipo;
            next();
        })(req, res, next);
    };

    // tipo 1 = Administrador
    public authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
        if (req.tipoUsuario !== 1) {
            res.status(403).json({ success: false, message: 'Acesso negado. Apenas administradores.' });
            return;
        }
        next();
    };

    // tipo <= 2 = Administrador ou Gerência
    public authorizeGerencia = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.tipoUsuario || req.tipoUsuario > 2) {
            res.status(403).json({ success: false, message: 'Acesso negado. Necessário perfil Gerência ou superior.' });
            return;
        }
        next();
    };

    // tipo <= 3 = Admin, Gerência ou Funcionário (exclui usuário externo)
    public authorizeFuncionario = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.tipoUsuario || req.tipoUsuario > 3) {
            res.status(403).json({ success: false, message: 'Acesso negado. Necessário perfil Funcionário ou superior.' });
            return;
        }
        next();
    };

    // Qualquer usuário autenticado (garante que authenticate foi chamado antes)
    public authorizeAll = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.tipoUsuario) {
            res.status(403).json({ success: false, message: 'Acesso negado.' });
            return;
        }
        next();
    };
}
