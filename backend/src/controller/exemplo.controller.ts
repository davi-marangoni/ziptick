import { Request, Response } from 'express';

/**
 * Exemplo de controller para funcionalidades futuras do ZipTick
 * Este é um template para criar novos controllers
 */

export class ExemploController {
    /**
     * Exemplo de método GET
     */
    public async exemplo(req: Request, res: Response): Promise<void> {
        try {
            // Lógica aqui
            res.status(200).json({
                success: true,
                data: {},
                message: 'Sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }
}
