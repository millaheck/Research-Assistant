document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User logged in successfully:", userCredential.user);
            window.location.href = 'questionnaire.html';
        })
        .catch((error) => {
            console.error("Sign-in error:", error);
            alert(error.message);
        });
});


