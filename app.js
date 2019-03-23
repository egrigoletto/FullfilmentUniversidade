// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
//banco de dados firebase
const admin = require('firebase-admin');
admin.initializeApp({
    //credenciais de acesso ao banco de dados
    credential: admin.credential.applicationDefault(),
    //url do banco
    databaseURL: 'url do firebase',
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
   function agendamentoLb(agent){
     //inclui itens no banco de dados 
     var newKey = admin.database().ref('lista-agendamento').push().key;
    
     //função set para incluir itens no banco de dados
     //new key cria uma chave para itens únicos no banco(chave primária)
     //set coloca os parâmetros no banco  que vem do agente
     admin.database().ref('lista-agendamento/'+newKey).set({
         //campos da tabela nosql
       	 ra: agent.parameters['ra-aluno'],
         //nome: agent.parameters['nome-aluno'],
         data: agent.parameters['data-agendamento'],
         curso: agent.parameters['nome-curso'],
         laboratorio: agent.parameters['tipo-laboratorio']
     });
     agent.add('Seu agendamento foi incluído com sucesso!\n Aguardamos sua visita 😃 ');
 }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  //seguindo moldelo acima
  //o intentmap mapeia a intent que vou usar para aplicar o fullfilment
  intentMap.set('agendamento.laboratorio', agendamentoLb);
  agent.handleRequest(intentMap);
});
