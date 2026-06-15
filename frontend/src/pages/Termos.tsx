import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Termos: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <Card>
                <Card.Header>
                    <h2 className="mb-0">Termos de Uso — ZipTick</h2>
                </Card.Header>
                <Card.Body>
                    <p className="text-muted">Última atualização: {new Date().getFullYear()}</p>

                    <h5>1. Aceitação dos Termos</h5>
                    <p>
                        Ao criar uma conta no ZipTick, você concorda com estes Termos de Uso.
                        Se não concordar, não utilize o sistema.
                    </p>

                    <h5>2. Uso do Sistema</h5>
                    <p>
                        O ZipTick é um sistema de gerenciamento de chamados destinado
                        ao controle e acompanhamento de solicitações de suporte. O uso deve ser
                        exclusivamente para fins relacionados às atividades da organização.
                    </p>

                    <h5>3. Responsabilidades do Usuário</h5>
                    <p>
                        O usuário é responsável por manter sigilo de suas credenciais de acesso.
                        Qualquer atividade realizada com sua conta é de sua responsabilidade.
                    </p>

                    <h5>4. Dados Pessoais</h5>
                    <p>
                        O sistema armazena o endereço de e-mail, nome e IP de acesso para fins
                        de segurança e auditoria, em conformidade com a LGPD.
                    </p>

                    <h5>5. Disponibilidade</h5>
                    <p>
                        A organização não garante disponibilidade contínua do sistema, podendo
                        realizar manutenções programadas com aviso prévio.
                    </p>

                    <div className="mt-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Voltar
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Termos;
