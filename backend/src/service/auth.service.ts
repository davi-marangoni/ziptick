import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Usuario } from '../interface/usuario';
import { UsuarioService } from './usuario.service';
import db from '../db/database';

interface JwtPayload {
    email: string;
    tipo: number;
    nome?: string;
    iat?: number;
    exp?: number;
}

const envJwtSecret = process.env.JWT_SECRET;
const envJwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!envJwtSecret) throw new Error('JWT_SECRET precisa ser definido nas variáveis de ambiente');
if (!envJwtExpiresIn) throw new Error('JWT_EXPIRES_IN precisa ser definido nas variáveis de ambiente');

export class AuthService {
    private usuarioService: UsuarioService;
    private jwtSecret: string;
    private jwtExpiresIn: string | number;

    constructor() {
        this.usuarioService = new UsuarioService();
        this.jwtSecret = envJwtSecret!;
        this.jwtExpiresIn = envJwtExpiresIn!;
    }

    public async hashPassword(senha: string): Promise<string> {
        return await bcrypt.hash(senha, 12);
    }

    public async verifyPassword(senha: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(senha, hash);
    }

    public generateToken(usuario: Pick<Usuario, 'email' | 'tipo' | 'nome'>): string {
        const payload: JwtPayload = {
            email: usuario.email,
            tipo: usuario.tipo,
            nome: usuario.nome
        };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
    }

    public verifyToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] }) as JwtPayload;
        } catch {
            return null;
        }
    }

    public async login(
        email: string,
        senha: string
    ): Promise<{ usuario: Omit<Usuario, 'senha'>; token: string } | null> {
        const usuario = await this.usuarioService.getUsuarioByEmail(email);
        if (!usuario) return null;

        const senhaValida = await this.verifyPassword(senha, usuario.senha);
        if (!senhaValida) return null;

        const { senha: _, ...usuarioSemSenha } = usuario;
        const token = this.generateToken(usuario);

        return { usuario: usuarioSemSenha, token };
    }

    public async solicitarResetSenha(email: string): Promise<void> {
        const usuario = await this.usuarioService.getUsuarioByEmail(email);
        // Responde igual mesmo se email não existir (não revela dados)
        if (!usuario) return;

        const token = crypto.randomUUID();
        const expiraEm = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await db.none(
            'INSERT INTO reset_senha_token (rest_usua_email, rest_token, rest_expira_em) VALUES ($1, $2, $3)',
            [email, token, expiraEm]
        );

        await this.enviarEmailResetSenha(email, token);
    }

    public async redefinirSenha(token: string, novaSenha: string): Promise<void> {
        const registro = await db.oneOrNone(
            `SELECT * FROM reset_senha_token
             WHERE rest_token = $1 AND rest_usado = FALSE AND rest_expira_em > NOW()`,
            [token]
        );

        if (!registro) throw new Error('Token inválido ou expirado');

        await this.usuarioService.updateSenhaUsuario(registro.rest_usua_email, novaSenha);
        await db.none(
            'UPDATE reset_senha_token SET rest_usado = TRUE WHERE rest_token = $1',
            [token]
        );
    }

    private async enviarEmailResetSenha(email: string, token: string): Promise<void> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${frontendUrl}/redefinir-senha?token=${token}`;

        if (!process.env.SMTP_HOST) {
            // Em desenvolvimento, exibe o link no console quando SMTP não está configurado
            console.log(`[DEV] Reset de senha para ${email}: ${link}`);
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"ZipTick" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Redefinição de senha — ZipTick',
            html: `
                <p>Você solicitou a redefinição de senha.</p>
                <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
                <p><a href="${link}">${link}</a></p>
                <p>Se não foi você, ignore este e-mail.</p>
            `
        });
    }
}
