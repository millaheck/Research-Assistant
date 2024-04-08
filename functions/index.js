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

        const text = `${data.problemDescription} ${data.problemRelevance} ${data.methodologyDescription} ${data.methodologyType} `;

        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        const [result] = await client.analyzeSentiment({ document });
        const sentiment = result.documentSentiment;

        let sentimentDescription = 'potential to be good research or not depends on how you approach the direction of your research';
        if (sentiment.score > 0) { 
            sentimentDescription = 'potencial to be worked on and make a good contribution to society';
        } else if (sentiment.score < 0) {
            sentimentDescription = 'perspectives to work on, even though you may face some problems if you do not address more specificity';
        }

        const briefSummary = `The research addresses ${data.problemDescription} as a problem research that has a ${sentimentDescription}. The methodology used will be ${data.methodologyDescription} and the ${data.methodologyType} approach will be utilized to explore the fact that ${data.problemRelevance}.`;

        await db.collection('analysisResults').doc(context.params.responseId).set({
            userId: data.userId,
            briefSummary,
            sentiment: sentiment.score,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Analysis and brief summary saved successfully.');
    });
    

   
