// Supondo que a inicialização do Firebase já foi feita no HTML
document.getElementById('questionnaire-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Recupera os valores dos campos
    const formData = {
        problemDescription: document.getElementById('problem-description').value.trim(),
        problemRelevance: document.getElementById('problem-relevance').value.trim(),
        methodologyType: document.getElementById('methodology-type').value,
        methodologyDescription: document.getElementById('methodology-description').value.trim(),
        dataCollectionMethod: document.getElementById('data-collection-method').value.trim(),
        researchPhases: document.getElementById('research-phases').value.trim(),
        projectDeadlines: document.getElementById('project-deadlines').value.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await firebase.firestore().collection('questionnaires').add(formData);
        alert('Questionnaire submitted successfully');
        window.location.href = '/results-page.html'; // Ajuste conforme necessário
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem with your submission: ' + error.message);
    }
});
