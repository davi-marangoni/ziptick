import { Router, Request, Response } from 'express';
import { KanbanController } from '../controller/kanban.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const kanbanController = new KanbanController();
const authMiddleware = new AuthMiddleware();

router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeFuncionario,
    async (req: Request, res: Response) => {
        await kanbanController.listarColunas(req, res);
    }
);

router.post('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await kanbanController.criarColuna(req, res);
    }
);

router.put('/reordenar',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await kanbanController.reordenarColunas(req, res);
    }
);

router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await kanbanController.atualizarColuna(req, res);
    }
);

router.delete('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await kanbanController.deletarColuna(req, res);
    }
);

export default router;
