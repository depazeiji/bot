var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 4bf5538c-104c-4665-b9e3-b1df1aabf397,
    appPassword: bSGgzjVH2mwho6e1ajsu2ke
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cb2675e5-fbea-4f8b-8951-f071e9fc7b38?subscription-key=f417501be8464aa6887fab37f4a12484&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers
dialog.matches('builtin.intent.places.find_place', [
  function(session, args, next){
    var tipoProducto = builder.EntityRecognizer.findEntity(args.entities, 'builtin.places.product');
    if (!tipoProducto) {
            builder.Prompts.text(session, "¿Qué buscas?");
        } else {
            next({ response: tipoProducto.entity });
        }
  },
  function (session, results) {
        if (results.response) {
            session.send("Buscas '%s'.", results.response);
            if(results.response.toLowerCase() == "pantalon" || results.response.toLowerCase() == "pantalones"
              || results.response.toLowerCase() == "pantalón"){
                builder.Prompts.text(session, "Tus opciones son Zara, Siman o Bullocks. ¿Cuál deseas ver?");
              }
            else if(results.response.toLowerCase() == "hamburguesa" || results.response.toLowerCase() == "hamburguesas")
              {
                builder.Prompts.text(session, "Tus opciones son Burger King o McDonalds. ¿Cuál deseas ver?");
              }
        } else {
            session.send("Ok");
        }
    },
  function (session, results) {
      var lugar = results.response;
      if(lugar.toLowerCase() == "zara"){
        var attachment = {
          contentUrl: 'http://siemprehayalgoqueponerse.com/wp-contenido/uploads/2015/07/pantalones-cropped-zara-pantalones-culotte-zara-shopping-pantalon-culotte-donde-comprar-pantalones-culotte.jpg',
          contentType: 'image/jpg',
          name: 'pantalon-zara.jpg'
        };
        var img = new builder.Message(session).addAttachment(attachment);
        session.send("Estos son los pantalones de Zara:")
        session.send(img);
      }
      else if(lugar.toLowerCase() == "siman"){
        var attachment = {
          contentUrl: 'http://www.siman.com/media/catalog/product/cache/1/image/300x300/9df78eab33525d08d6e5fb8d27136e95/1/0/100697703_2_2.jpg',
          contentType: 'image/jpg',
          name: 'pantalon-siman.jpg'
        };
        var attachment2 = {
          contentUrl: 'http://www.siman.com/media/catalog/product/cache/1/image/300x300/9df78eab33525d08d6e5fb8d27136e95/1/0/100610744__2.jpg',
          contentType: 'image/jpg',
          name: 'pantalon-siman2.jpg'
        };
        var img = new builder.Message(session).addAttachment(attachment);
        var img2 = new builder.Message(session).addAttachment(attachment2);
        session.send("Estos son los pantalones de Siman:")
        session.send(img);
        session.send(img2);
      }
      else if(lugar.toLowerCase() == "bullocks"){
        var attachment = {
          contentUrl: 'http://2.bp.blogspot.com/-DSzJ8hHD54A/VkTwsDjJ-cI/AAAAAAAAABs/6fXkg5lQhPQ/s1600/pantalones-de-moda-para-mujeres1.jpg',
          contentType: 'image/jpg',
          name: 'pantalon-bullocks.jpg'
        };
        var img = new builder.Message(session).addAttachment(attachment);
        session.send("Estos son los pantalones de Bullocks:")
        session.send(img);
      }
      else if(lugar.toLowerCase().includes("king")){
        var attachment = {
          contentUrl: 'http://www.bk.com/sites/default/files/Thumb_0000_Burgers.jpg',
          contentType: 'image/jpg',
          name: 'hamburguesa-king.jpg'
        };
        var img = new builder.Message(session).addAttachment(attachment);
        session.send("Esta es la hamburguesa de Burger King:")
        session.send(img);
      }
      else if(lugar.toLowerCase().includes("donald")){
        var attachment = {
          contentUrl: 'http://static02.ofertia.cl/catalogos/e1b96404-a1d1-41d6-a097-3f5b3e009d82/0/normal.v1.jpg',
          contentType: 'image/jpg',
          name: 'hamburguesa-mc.jpg'
        };
        var img = new builder.Message(session).addAttachment(attachment);
        session.send("Esta es la hamburguesa de McDonalds:")
        session.send(img);
      }
      session.endDialog();
  }
]);
//dialog.matches('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'));
dialog.onDefault(builder.DialogAction.send("Lo siento. No entiendo lo que pides. Solo puedo hacer búsquedas."));
//=========================================================
// Bots Dialogs
//=========================================================
/*var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);*/
