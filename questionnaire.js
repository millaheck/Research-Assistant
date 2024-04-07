import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection,  doc, getDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('email-form').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const user = auth.currentUser;
        if (!user) {
            alert('You need to be logged in to submit this form.');
            window.location.href = 'signin.html';
            return;
        }
    
        const formData = {
            problemDescription: document.getElementById('problem-description').value.trim(),
            problemRelevance: document.getElementById('problem-relevance').value.trim(),
            methodologyType: document.getElementById('methodology-type').value,
            methodologyDescription: Array.from(document.querySelectorAll('[name="response"]:checked')).map(el => el.value),
            researchPhasesPreparatory: Array.from({ length: 5 }, (_, i) => document.getElementById(`preparatory-task-${i + 1}`).value.trim()),
            researchPhasesCollection: Array.from({ length: 5 }, (_, i) => document.getElementById(`collection-task-${i + 1}`).value.trim()),
            researchPhasesAnalysis: Array.from({ length: 5 }, (_, i) => document.getElementById(`analysis-task-${i + 1}`).value.trim()),
            projectDeadlines: Array.from({ length: 4 }, (_, i) => ({
                delivery: document.getElementById(`delivery${i + 1}`).value.trim(),
                date: document.getElementById(`date${i + 1}`).value
            })),
            userId: user.uid,
            timestamp: serverTimestamp(), 
        };
    
        try {
            const docRef = await addDoc(collection(db, "questionnaireResponses"), formData);
            console.log('Questionnaire submitted successfully, document ID:', docRef.id);
            window.location.href = 'results.html';
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            alert('There was a problem with your submission: ' + error.message);
        }
    });
});
