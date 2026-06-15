import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import passport = require('./config/passport.config');
import usuarioRouter from './routes/usuario.router';
import authRouter from './routes/auth.router';
import setorRouter from './routes/setor.router';
import chamadoRouter from './routes/chamado.router';
import kanbanRouter from './routes/kanban.router';
import campoRouter from './routes/campo.router';
import notificacaoRouter from './routes/notificacao.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Garante que a pasta uploads exista
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middlewares globais
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') { res.sendStatus(200); } else { next(); }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.use(passport.initialize());

app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas da API
app.use('/api/auth',          authRouter);
app.use('/api/usuarios',      usuarioRouter);
app.use('/api/setores',       setorRouter);
app.use('/api/chamados',      chamadoRouter);
app.use('/api/kanban',        kanbanRouter);
app.use('/api/campos',        campoRouter);
app.use('/api/notificacoes',  notificacaoRouter);

app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'API funcionando', timestamp: new Date().toISOString() });
});

app.use('*', (_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint não encontrado' });
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Erro interno:', error);
    res.status(500).json({ success: false, message: `Erro interno: ${error.message}` });
});

app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});

export default app;
