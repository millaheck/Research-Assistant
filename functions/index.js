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

     

    async function fetchMethodologyOverview(userId) {
        const docRef = db.collection('questionnaireResponses/{responseId}').doc(userId);
        const doc = await docRef.get();
        if (!doc.exists) {
            console.log('No such document!');
            return null;
        } else {
            const data = doc.data();
            const researchPhasesPreparatory = data.researchPhasesPreparatory || [];
            const researchPhasesCollection = data.researchPhasesCollection || [];
            const researchPhasesAnalysis = data.researchPhasesAnalysis || [];
    
            let methodologyOverview = "Methodology Overview:\n";
            methodologyOverview += "Preparatory Phase: " + researchPhasesPreparatory.join(", ") + "\n";
            methodologyOverview += "Data Collection Phase: " + researchPhasesCollection.join(", ") + "\n";
            methodologyOverview += "Data Analysis Phase: " + researchPhasesAnalysis.join(", ");
    
            return methodologyOverview;
        }
    }
    
    async function displayMethodologyOverview(userId) {
        const methodologyOverview = await fetchMethodologyOverview(userId);
        if (methodologyOverview) {
            console.log(methodologyOverview);
        
        } else {
            console.log("Unable to fetch methodology overview.");
        }
    }

    displayMethodologyOverview('userId');
    


    async function fetchTimetable(userId) {
        const docRef = db.collection('questionnaireResponses/{responseId}').doc(userId);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            return docSnap.data(); 
        } else {
            console.log("No such document!");
            return null;
        }
    }
    
    async function displayTimetable(userId) {
        const data = await fetchTimetable(userId);
        
        if (data) {
            const timetable = document.getElementById('timetable');
            
            let htmlContent = '<h2>Project Timetable</h2><table><tr><th>Task</th><th>Deadline</th></tr>';
            
            data.projectDeadlines.forEach(deadline => {
                htmlContent += `<tr><td>${deadline.task}</td><td>${deadline.date}</td></tr>`;
            });
            
            htmlContent += '</table>';
            timetable.innerHTML = htmlContent;
        }
    }
    
    displayTimetable('userId');

    const briefSummary = `The research addresses ${data.problemDescription} as a problem research that has a ${sentimentDescription}. The methodology used will be ${data.methodologyDescription} and the ${data.methodologyType} approach will be utilized to explore the fact that ${data.problemRelevance}.`;

    await db.collection('analysisResults').doc(context.params.responseId).set({
        userId: data.userId,
        briefSummary,
        methodologyOverview,
        timetable,
        sentiment: sentiment.score,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Analysis and brief summary saved successfully.');
});