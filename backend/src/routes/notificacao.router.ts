import { Router, Request, Response } from 'express';
import { NotificacaoController } from '../controller/notificacao.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const notificacaoController = new NotificacaoController();
const authMiddleware = new AuthMiddleware();

router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await notificacaoController.listar(req, res);
    }
);

router.put('/todas-lidas',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await notificacaoController.marcarTodasLidas(req, res);
    }
);

router.put('/:id/lida',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await notificacaoController.marcarLida(req, res);
    }
);

export default router;
