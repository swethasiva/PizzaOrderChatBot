# PizzaOrderChatBot
A chatbot assistant to help you order pizza.
Click [here](https://drive.google.com/file/d/1ZaEKGgEMk70w49x-CJuJbqaUjHDomFi4/view) for demo
Database snashopt after making a new order:

### Dialogflow: 
A natural language understanding platform by google. It has been used in this project to aid the natural language processing and conversational features of the chatbot. 

### Firebase
It Google's application development platform to aid build highly scalable and fast applications. It offers two client accessible databases. In this project I have used Firestore, a NoSQL database due its high scalability and querying speed.

### Google Cloud Functions
In order to make the bot to be more dynamically responsive to the user queries and To connect to the project's database, which is Cloud Firestore we need to make fullfillments using Node.js. For the same, we create a project on google cloud which is linked to our chatbot and enable cloud functions. 

### Node.js 
Node.js is a Javascript runtime built on Google's v8 engine. In this project Node.js is used for creating the fullfillments that will be triggered when an certain Intent is called when a user asks a matching query. 




