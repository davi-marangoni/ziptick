import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_API_URL;

interface Usuario {
    email: string;
    tipo: number;
}

const Users: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/usuarios`);
            setUsuarios(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (email: string) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            await axios.delete(`${apiUrl}/api/usuarios/${email}`);
            setUsuarios(usuarios.filter(u => u.email !== email));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao deletar usuário');
        }
    };

    if (loading) return <Container className="py-4">Carregando...</Container>;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Usuários</h1>
                <Link to="/usuarios/cadastrar">
                    <Button variant="success">Novo Usuário</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.email}>
                            <td>{usuario.email}</td>
                            <td>{usuario.tipo === 1 ? 'Administrador' : 'Usuário'}</td>
                            <td>
                                <Link to={`/usuarios/editar-senha/${usuario.email}`}>
                                    <Button size="sm" variant="warning" className="me-2">
                                        Editar Senha
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDelete(usuario.email)}
                                >
                                    Deletar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Users;
