/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.generateResults = functions.firestore
    .document('questionnaireResponses/{responseId}')
    .onCreate((snapshot, context) => {
        // Aqui entra a lógica de processamento das respostas
        const responses = snapshot.data();

        // Digamos que você queira analisar a metodologia escolhida e gerar uma descrição
        const methodologyOverview = generateMethodologyOverview(responses.methodologyType, responses.methodologyOptions);
        // Para o cronograma, talvez você queira mapear as fases da pesquisa e as respectivas tarefas
        const timetable = generateTimetable(responses.researchPhases);
        // Para o resumo, você precisará compilar as respostas em um formato textual
        const briefSummary = generateBriefSummary(responses.problemDescription, responses.problemRelevance);

        // Após gerar todos os resultados necessários, você os salvará em um documento no Firestore
        return admin.firestore().collection('results').doc(context.params.responseId).set({
            methodologyOverview,
            timetable,
            briefSummary
        });
    });

function generateMethodologyOverview(methodologyType, options) {
    // Vamos criar uma descrição simples baseada no tipo de metodologia e nas opções escolhidas
    let description = `The chosen methodology is ${methodologyType}. `;
    description += 'The following approaches will be used: ';
    description += options.join(', ') + '.';
    return description;
}

function generateTimetable(phases) {
    // Aqui você pode estruturar como as fases da pesquisa serão apresentadas
    // Isso pode envolver a criação de um gráfico de Gantt ou uma simples lista de tarefas
    // Por simplicidade, vamos apenas listar as tarefas
    let timetable = 'Research Phases:\n';
    for (const phase in phases) {
        timetable += `${phase} includes the tasks: ${phases[phase].join(', ')}.\n`;
    }
    return timetable;
}

function generateBriefSummary(problemDescription, problemRelevance) {
    // Vamos compilar um breve resumo baseado na descrição e relevância do problema
    return `The research focuses on the problem: ${problemDescription}. ` +
           `This research is relevant because ${problemRelevance}.`;
}
