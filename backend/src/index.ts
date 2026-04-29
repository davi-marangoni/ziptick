import express from 'express';
import dotenv from 'dotenv';
import passport = require('./config/passport.config');
import usuarioRouter from './routes/usuario.router';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use((req, res, next) => {
    // CORS manual para desenvolvimento
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializa o Passport
app.use(passport.initialize());

// Middleware para logs de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas da API
app.use('/api/usuarios', usuarioRouter);

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// Rota padrão para endpoints não encontrados
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});

// Middleware de tratamento de erros
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro interno:', error);
    res.status(500).json({
        success: false,
        message: `Erro interno do servidor: ${error.message}`
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📋 API disponível em http://localhost:${PORT}`);
    console.log(`🏥 Health check em http://localhost:${PORT}/health`);
    console.log(`👤 Rotas de usuário em http://localhost:${PORT}/api/usuarios`);
});

export default app;
