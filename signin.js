document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Exemplo com Firebase Auth
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Se o sign-in for bem-sucedido, redirecione para outra página ou faça alguma ação
            console.log("User logged in successfully:", userCredential.user);
            // Redirecione para a página desejada aqui
            window.location.href = 'questionnaire.html';
        })
        .catch((error) => {
            console.error("Sign-in error:", error);
            // Informe ao usuário que houve um erro, talvez mostrando uma mensagem na página
            alert(error.message);
        });
});


