import { Router, Request, Response } from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();
const authController = new AuthController();

// Rotas públicas de autenticação
router.post('/esqueci-senha', async (req: Request, res: Response) => {
    await authController.solicitarResetSenha(req, res);
});

router.post('/redefinir-senha', async (req: Request, res: Response) => {
    await authController.redefinirSenha(req, res);
});

export default router;
