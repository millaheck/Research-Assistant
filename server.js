const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password);
    res.status(200).json({ message: 'Signup successful' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('Attempt to login with Email:', email, 'and Password:', password);
    
    if (email === "usuario@example.com" && password === "senha123") {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});

app.post('/submit-questionnaire', (req, res) => {
    console.log('Questionnaire Data:', req.body);
    res.status(200).json({ message: 'Questionnaire submitted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});