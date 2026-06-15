import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { ChamadoController } from '../controller/chamado.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const chamadoController = new ChamadoController();
const authMiddleware = new AuthMiddleware();

const storage = multer.diskStorage({
    destination: path.join(process.cwd(), 'uploads'),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${unique}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
    }
});

router.post('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    upload.array('anexos', 10),
    async (req: Request, res: Response) => {
        await chamadoController.criar(req, res);
    }
);

router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await chamadoController.listar(req, res);
    }
);

router.get('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeAll,
    async (req: Request, res: Response) => {
        await chamadoController.buscarPorId(req, res);
    }
);

router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeFuncionario,
    async (req: Request, res: Response) => {
        await chamadoController.atualizar(req, res);
    }
);

export default router;
