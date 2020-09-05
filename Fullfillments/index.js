'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function OrderStatusReply(agent) {
    let orderId = agent.parameters.any;
    const dialogflowAgentDoc = db.collection('Orders').doc(orderId);

    // Get the value of 'entry' in the document and send it to the user
    return dialogflowAgentDoc.get()
      .then(doc => {
        if (!doc.exists) {
          agent.add('Oops!! It looka like your order has not been placed yet! Sorry for the inconvenience, But No worries, you can place your order ASAP by saying "I want to order a Pizza"');
        } else {
          var data = doc.data();
          var diff = parseInt((Date.now()-data["OrderTime"])/60000, 10);
          
         // agent.add(`${diff}`);
          var res;
          if(diff <= 5) {
            res="Your Order has reached the hotel's chef";
          } else if (diff >5 && diff<=15) {
          res = "Your Order is being cooked";}
          else if(diff>15 && diff<=40) {
          res = "Our Delivery partner has started out with the order. He will reach your location very soon.";}
          else if (diff>40){
          res = "Your Order has been Delivered!! Have a great Meal. Looking forward to your order with us very soon.";}
          
          agent.add(`${res}`);
          agent.add(`The following are your Order Details:`);
          
          
for (const key in data) {
    let value = data[key];
  	if(key=='OrderTime'){
    	value = new Date(value);
        value = value.toString();
    }
    agent.add(`${key} : ${value}`);
    // now key and value are the property name and value
}
        }
        return Promise.resolve('Read complete');
      });
   // agent.add(`Your  order Id is "${orderId}"`);
  }
  
  function PlaceOrder(agent) {
    //let name = agent.parameters.any;
    let Cname = agent.parameters.any;
    let Psize = agent.parameters.Size;
    let Ptype = agent.parameters.Type;
    let Ptoppings = agent.parameters.Toppings;
    let count = agent.parameters.Count;
    //var mydb = db.collection("Orders").doc();
    //mydb.add({Name:Cname});
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 10; i++) {
    	autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    //const Time = admin.firestore.FieldValue.serverTimestamp();
    const Time = Date.now();
    const dialogflowAgentRef = db.collection('Orders').doc(autoId);
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, {OrderId:autoId, Name: Cname, PizzaSize: Psize, PizzaType: Ptype, Toppings: Ptoppings, Count: count, OrderTime: Time});


      return Promise.resolve('Write complete');
    }).then(doc => {
      //agent.add(`Wrote "${Cname}" to the Firestore database`);
      agent.add(`Your Order has been Successfully Placed and your Order Id for tracking your order is "${autoId}". Thank you for ordering with us.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      agent.add(`Failed to write "${Cname}" to the Firestore database.`);
    }); 
  }

  let intentMap = new Map();
  intentMap.set('PlaceOrder', PlaceOrder);
  intentMap.set('OrderStatusReply', OrderStatusReply);
  intentMap.set('Default Fallback Intent', fallback);
 
  agent.handleRequest(intentMap);
});
