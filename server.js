require("dotenv").config({ path: "./.env.dev" })

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve os arquivos HTML/CSS

// Simulando um banco de dados em memória
let users = [];

// Endpoint para cadastrar usuários
app.post('/register', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send('Nome e e-mail são obrigatórios.');
    }

    users.push({ name, email });
    res.send('Cadastro realizado com sucesso!');
});

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE_TYPE, // Use 'gmail', 'hotmail', ou outro provedor
    auth: {
        user: process.env.NODEMAILER_AUTH_USER, // Seu e-mail
        pass: process.env.NODEMAILER_AUTH_PASSWORD // Senha de aplicativo gerada
    }
});

// Tarefa agendada para enviar e-mails diariamente às 7h
cron.schedule(process.env.CRON_TIMING, () => {
    users.forEach(user => {
        const mailOptions = {
            from: process.env.NODEMAILER_AUTH_USER, // E-mail do remetente
            to: user.email, // E-mail do destinatário
            subject: 'Bom dia!', // Assunto do e-mail
            text: `Olá, ${user.name}! Aqui está seu e-mail diário.` // Corpo do e-mail
        };

        // Envia o e-mail para cada usuário
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Erro ao enviar para ${user.email}:`, error);
            } else {
                console.log(`E-mail enviado para ${user.email}:`, info.response);
            }
        });
    });
});

// Teste de envio de e-mail (rota /enviar-email)
app.get('/enviar-email/:email', (req, res) => {
    const mailOptions = {
        from: process.env.NODEMAILER_AUTH_USER, // E-mail do remetente
        to: req.params["email"], // E-mail do destinatário (teste)
        subject: 'Bem-vindo ao nosso sistema!',
        text: 'Olá, este é um e-mail enviado automaticamente pelo seu programa em Node.js!'
    };

    // Envia o e-mail de teste
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error);
            res.status(500).send('Erro ao enviar o e-mail');
        } else {
            console.log('E-mail enviado:', info.response);
            res.send('E-mail enviado com sucesso!');
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
