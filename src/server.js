// Importações
import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import { DatabaseUser } from './database-user.js';

// Inicialização
const app = express();
const database = new DatabaseUser();

// Configurações do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Rotas GET
app.get('/users', (req, res) => {
    const users = database.list();
    console.log(users);
    return res.json(users);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'cadastro.html'));
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    // Buscar usuário pelo email
    const user = database.findByEmail(email);

    if (!user) {
        return res.status(401).json({ error: 'Email não encontrado.' });
    }

    // Comparar senha fornecida com a senha hash no banco de dados
    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
        return res.status(401).json({ error: 'Senha inválida.' });
    }

    if (user.payment) {
        return res.sendFile(path.join(process.cwd(), 'views', 'feed.html'));
    } else {
        return res.sendFile(path.join(process.cwd(), 'views', 'payment.html'));
    }
});

app.post('/cadastro', async (req, res) => {
    const { nome, email, cpf, payment, senha } = req.body;

    if (!senha) {
        return res.status(400).json({ error: 'Senha não fornecida.' });
    }

    try {
        const hashedpassword = await bcrypt.hash(senha, 10);

        if (database.emailExists(email)) {
            return res.status(400).json({ error: 'Este email já está cadastrado.' });
        }

        if (database.cpfExists(cpf)) {
            return res.status(400).json({ error: 'Este CPF já está cadastrado.' });
        }

        if (!nome || !email || !cpf || !senha) {
            return res.status(400).json({ error: 'Por favor, forneça nome, email, cpf e senha.' });
        }

        database.create({ nome, email, cpf, payment: false, senha: hashedpassword });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// Inicialização do servidor
app.listen(3333, () => {
    console.log('Servidor online na porta 3333!');
});
