const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const db = admin.firestore();

exports.analyzeTextAndGenerateResults = functions.firestore
    .document('questionnaireResponses/{responseId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();

        // Combina as respostas das perguntas 1, 2 e 3 para análise
        const text = `${data.problemDescription} ${data.problemRelevance} ${data.methodologyDescription} ${data.methodologyType} `;

        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // Chamada para a API do Google Cloud Natural Language para analisar o sentimento
        const [result] = await client.analyzeSentiment({ document });
        const sentiment = result.documentSentiment;

        // Construa um resumo baseado nos resultados da análise
        const briefSummary = `The research addresses "${data.problemDescription}" as a problem research with a ${sentiment.score} outlook and magnitude ${sentiment.magnitude}. The methodology used will be "${data.methodologyDescription}" and the ${data.methodologyType} approach will be utilized to explore the relevance of "${data.problemRelevance}".`;

        // Salve o resumo e os resultados da análise no Firestore
        await db.collection('analysisResults').doc(context.params.responseId).set({
            userId: data.userId,
            briefSummary,
            sentimentScore: sentiment.score,
            sentimentMagnitude: sentiment.magnitude,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Analysis and brief summary saved successfully.');
    });


    exports.processQuestionnaireSubmission = functions.firestore
    .document("questionnaireResponses/{responseId}")
    .onCreate((snap, context) => {
        const data = snap.data();
        const methodologyOverview = `Methodology: ${data.methodologyDescription.join(", ")}. Research phases: ${data.research-phases}`;

        // Salvar o overview da metodologia no Firestore em um novo documento ou campo
        return db.collection("methodologyOverviews").doc(context.params.responseId).set({
            overview: methodologyOverview,
            userId: data.userId,
            // Adicione outras informações necessárias aqui
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    });
