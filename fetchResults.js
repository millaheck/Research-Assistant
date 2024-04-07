import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPjv94orRGsAntSYukwaPGRydWOvtFcW4",
    authDomain: "research-assistant-a8c24.firebaseapp.com",
    projectId: "research-assistant-a8c24",
    storageBucket: "research-assistant-a8c24.appspot.com",
    messagingSenderId: "914211567397",
    appId: "1:914211567397:web:cbb4b0acb1f9f9fc900ccc",
    measurementId: "G-1DG6QE214B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const fetchAndDisplayResults = async (userId) => {
    const resultsRef = collection(db, 'analysisResults');
    const q = query(resultsRef, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const latestResult = querySnapshot.docs[0].data();
        document.getElementById('briefSummary').textContent = latestResult.briefSummary;
        document.getElementById("methodologyOverview").textContent = latestResult.overview;
        document.getElementById("timetable").textContent = latestResult.timetable;
    } else {
        console.log("Não foram encontrados resultados de análise para o usuário.");
    }
};

// Certifique-se de que o DOM está totalmente carregado antes de tentar acessar elementos do DOM ou autenticar o usuário
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchAndDisplayResults(user.uid);
        } else {
            console.log("Usuário não está logado.");
        }
    });
});