export interface Usuario {
    email: string;
    senha: string;
    tipo: number; // 1=Admin 2=Gerência 3=Funcionário 4=Usuário externo
    nome?: string;
    ip_criacao?: string;
    criado_em?: Date;
    aceitou_termos?: boolean;
    seto_id?: number;
    cargo?: string;
}
