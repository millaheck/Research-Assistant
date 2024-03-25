const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para parsear JSON

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password);
    // Aqui, você adicionaria lógica para processar os dados de inscrição, como salvar em um banco de dados
    res.status(200).json({ message: 'Signup successful' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('Attempt to login with Email:', email, 'and Password:', password);
    
    // Aqui, você deveria verificar se o email e a senha estão corretos
    // Este é apenas um exemplo simplificado
    if (email === "usuario@example.com" && password === "senha123") {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});

app.post('/submit-questionnaire', (req, res) => {
    // Aqui você captura os dados do questionário enviados
    console.log('Questionnaire Data:', req.body);
    
    // Aqui você implementaria sua lógica de processamento, como salvar no banco de dados
    // Por agora, vamos apenas responder que foi recebido com sucesso
    res.status(200).json({ message: 'Questionnaire submitted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});