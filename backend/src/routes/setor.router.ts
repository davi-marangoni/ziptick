import { Router, Request, Response } from 'express';
import { SetorController } from '../controller/setor.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const setorController = new SetorController();
const authMiddleware = new AuthMiddleware();

// Qualquer usuário autenticado pode listar setores (necessário para formulários de chamado)
router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await setorController.listar(req, res);
    }
);

// Criação, edição e exclusão requerem Gerência ou Admin
router.post('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await setorController.criar(req, res);
    }
);

router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await setorController.atualizar(req, res);
    }
);

router.delete('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeGerencia,
    async (req: Request, res: Response) => {
        await setorController.deletar(req, res);
    }
);

export default router;
