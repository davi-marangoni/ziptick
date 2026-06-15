import { Router, Request, Response } from 'express';
import { CampoController } from '../controller/campo.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const campoController = new CampoController();
const authMiddleware = new AuthMiddleware();

router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await campoController.listar(req, res);
    }
);

router.post('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await campoController.criar(req, res);
    }
);

router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await campoController.atualizar(req, res);
    }
);

router.delete('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await campoController.deletar(req, res);
    }
);

export default router;
