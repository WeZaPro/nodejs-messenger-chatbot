require("dotenv").config();
import request from "request";

let postWebhook = (req, res) =>{
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// Handles messages events //test-----*******************
// function handleMessage(sender_psid, received_message) {
//     let response;

//     // check message
//     console.log("get message----> ",received_message);
//     console.log("get message.text123----> ",received_message.text);
//     // Check if the message contains text
//     if (received_message.text) {

//         //test-----*******************
//         // callSendAPI(sender_psid, "Thank you for watching my video !!!");
       
//         callSendAPI(sender_psid, received_message.text);
//         callSendAPIWithTemplate(sender_psid);
        

        

//         // Create the payload for a basic text message
//         response = {
//             "text": `You sent the message: "${received_message.text}". Now send me an image!`
//         }
//     } else if (received_message.attachments) {

//     // Gets the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
//         response = {
//             "attachment": {
//                 "type": "template",
//                 "payload": {
//                     "template_type": "generic",
//                     "elements": [{
//                         "title": "Is this the right picture?",
//                         "subtitle": "Tap a button to answer.",
//                         "image_url": attachment_url,
//                         "buttons": [
//                             {
//                                 "type": "postback",
//                                 "title": "Yes!",
//                                 "payload": "yes",
//                             },
//                             {
//                                 "type": "postback",
//                                 "title": "No!",
//                                 "payload": "no",
//                             }
//                         ],
//                     }]
//                 }
//             }
//         }

// }

// // Sends the response message
//     callSendAPI(sender_psid, response);
// }

// Handles messages events //test-----******************* 2
function handleMessage(sender_psid, received_message) {

    let response;

    // if (received_message.text) {    
    //      response = {
    //          "text": `You sent the message: "${received_message.text}". Now send me an image!`
    //  }
    //     callSendAPI2(sender_psid, response);
    //     callSendAPI(sender_psid, received_message.text);
    //     callSendAPIWithTemplate(sender_psid);
    // }

    if (received_message.text === "1") {    
        response = {
            "text": `You sent the message: 0000-1 !`
        }

        callSendAPI2(sender_psid, response);
        callSendAPI(sender_psid, received_message.text);
        callSendAPIWithTemplate(sender_psid);
      
    } else{
        response = {
            "text": `You sent the message: ${received_message.text} !`
        }

        callSendAPI2(sender_psid, response);
        callSendAPI(sender_psid, received_message.text);
        callSendAPIWithTemplate(sender_psid);
        callSendAPIWithTemplate2(sender_psid);
      
    }


    
    
  }



// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// test------------
function callSendAPI2(sender_psid, response) {
    console.log("callSendAPI2--> respone---->", response);
    // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },

    "message": response

  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.FB_PAGE_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
  }

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

    console.log("get response from callSendApi --> ",response);

    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": { "text": response }
    };

    //test---*******************


    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

// function firstTrait(nlp, name) {
//     return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
// }

function firstTrait(nlp, name) {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

// function handleMessage(sender_psid, message) {
//     //handle message for react, like press like button
//     // id like button: sticker_id 369239263222822

//     if( message && message.attachments && message.attachments[0].payload){
//         callSendAPI(sender_psid, "Thank you for watching my video !!!");
//         callSendAPIWithTemplate(sender_psid);
//         return;
//     }

//     let entitiesArr = [ "wit$greetings", "wit$thanks", "wit$bye" ];
//     let entityChosen = "";
//     entitiesArr.forEach((name) => {
//         let entity = firstTrait(message.nlp, name);
//         if (entity && entity.confidence > 0.8) {
//             entityChosen = name;
//         }
//     });

//     if(entityChosen === ""){
//         //default
//         callSendAPI(sender_psid,`The bot is needed more training, try to say "thanks a lot" or "hi" to the bot` );
//     }else{
//        if(entityChosen === "wit$greetings"){
//            //send greetings message
//            callSendAPI(sender_psid,'Hi there! This bot is created by Hary Pham. Watch more videos on HaryPhamDev Channel!');
//        }
//        if(entityChosen === "wit$thanks"){
//            //send thanks message
//            callSendAPI(sender_psid,`You 're welcome!`);
//        }
//         if(entityChosen === "wit$bye"){
//             //send bye message
//             callSendAPI(sender_psid,'bye-bye!');
//         }
//     }
// }

let callSendAPIWithTemplate = (sender_psid) => {
    // document fb message template
    // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
    let body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "welcome to onlineSabuyMe Website",
                            "image_url": "https://www.onlinesabuyme.co.th/wp-content/uploads/2022/09/27100-Converted-04-768x768.png",
                            "subtitle": "Access to Smart marketing channel",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://www.onlinesabuyme.co.th/",
                                    "title": "Watch now"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": body
    }, (err, res, body) => {
        if (!err) {
             console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

let callSendAPIWithTemplate2 = (sender_psid) => {
    // document fb message template
    // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
    let body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                  "elements": [
                    {
                      "buttons": [
                        {
                          "type": "web_url",
                          "url": "https://siribox.sirivatana.co.th",
                          "title": "ขอรายละเอียด"
                        },
                        {
                          "type": "postback",
                          "payload": "PriceList",
                          "title": "สอบถามราคา"
                        },
                        {
                          "payload": "Estimate",
                          "type": "postback",
                          "title": "คำนวนราคา"
                        }
                      ],
                      "image_url": "https://scontent.fbkk5-4.fna.fbcdn.net/v/t39.30808-6/306575973_613886746861410_4266199771047810890_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=730e14&_nc_ohc=Y-P4qXwTVTYAX-EheUj&_nc_ht=scontent.fbkk5-4.fna&oh=00_AT-kzV6dtAN8ND5Y1vCgjUkoldbL8l1puLmiEPKUHgXIzg&oe=6343B450",
                      "title": "Packaging A",
                      "subtitle": "Detail Packaging A",
                      "default_action": {
                        "webview_height_ratio": "full",
                        "url": "https://siribox.sirivatana.co.th/",
                        "type": "web_url"
                      }
                    },
                    {
                      "default_action": {
                        "type": "web_url",
                        "webview_height_ratio": "full",
                        "url": "https://siribox.sirivatana.co.th/"
                      },
                      "image_url": "https://scontent.fbkk5-3.fna.fbcdn.net/v/t39.30808-6/310428819_628543822062369_7249461621886316794_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=730e14&_nc_ohc=eB22wAN1riYAX_O-290&_nc_ht=scontent.fbkk5-3.fna&oh=00_AT8SkfqJRo5QhCn8HeBko8D61yU04EySJUDsOXhWGQDT8A&oe=63434B0B",
                      "buttons": [
                        {
                          "url": "https://siribox.sirivatana.co.th",
                          "title": "ขอรายละเอียด",
                          "type": "web_url"
                        },
                        {
                          "payload": "PriceList",
                          "type": "postback",
                          "title": "สอบถามราคา"
                        },
                        {
                          "title": "คำนวนราคา",
                          "type": "postback",
                          "payload": "Estimate"
                        }
                      ],
                      "title": "Packaging B",
                      "subtitle": "Detail Packaging B"
                    },
                    {
                      "default_action": {
                        "type": "web_url",
                        "url": "https://siribox.sirivatana.co.th/",
                        "webview_height_ratio": "full"
                      },
                      "subtitle": "Detail Packaging C",
                      "image_url": "https://scontent.fbkk5-5.fna.fbcdn.net/v/t39.30808-6/310669646_628542938729124_4845211762759805626_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=730e14&_nc_ohc=r1zaRESZR1QAX9R6lLK&_nc_ht=scontent.fbkk5-5.fna&oh=00_AT-P86C9iDHsf0zuHtZePnrxZrtTL1s2oVBgZumzrMh4tQ&oe=634389F0",
                      "title": "Packaging C",
                      "buttons": [
                        {
                          "title": "ขอรายละเอียด",
                          "type": "web_url",
                          "url": "https://siribox.sirivatana.co.th"
                        },
                        {
                          "type": "postback",
                          "title": "สอบถามราคา",
                          "payload": "PriceList"
                        },
                        {
                          "title": "คำนวนราคา",
                          "payload": "Estimate",
                          "type": "postback"
                        }
                      ]
                    },
                    {
                      "image_url": "https://scontent.fbkk5-3.fna.fbcdn.net/v/t39.30808-6/310437869_628542912062460_38473656999760349_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=ImSrYGRjUF8AX98IoRa&_nc_ht=scontent.fbkk5-3.fna&oh=00_AT9Fh6sZKxHA3Oh7tuMB7Dvx96eObVcLI3a-_e1cOR5-Xg&oe=63434884",
                      "default_action": {
                        "webview_height_ratio": "full",
                        "type": "web_url",
                        "url": "https://siribox.sirivatana.co.th/"
                      },
                      "subtitle": "Detail Packaging D",
                      "buttons": [
                        {
                          "title": "ขอรายละเอียด",
                          "type": "web_url",
                          "url": "https://siribox.sirivatana.co.th"
                        },
                        {
                          "title": "สอบถามราคา",
                          "type": "postback",
                          "payload": "PriceList"
                        },
                        {
                          "title": "คำนวนราคา",
                          "type": "postback",
                          "payload": "Estimate"
                        }
                      ],
                      "title": "Packaging D"
                    },
                    {
                      "buttons": [
                        {
                          "title": "ขอรายละเอียด",
                          "type": "web_url",
                          "url": "https://siribox.sirivatana.co.th"
                        },
                        {
                          "title": "สอบถามราคา",
                          "type": "postback",
                          "payload": "PriceList"
                        },
                        {
                          "title": "คำนวนราคา",
                          "type": "postback",
                          "payload": "Estimate"
                        }
                      ],
                      "default_action": {
                        "url": "https://siribox.sirivatana.co.th/",
                        "type": "web_url",
                        "webview_height_ratio": "full"
                      },
                      "title": "Packaging E",
                      "subtitle": "Detail Packaging E",
                      "image_url": "https://scontent.fbkk5-4.fna.fbcdn.net/v/t39.30808-6/310398255_628542892062462_5022278135923982550_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=kNEJs83HAS0AX-5vRpD&_nc_ht=scontent.fbkk5-4.fna&oh=00_AT9PqXFfCpCjrxE6J08f0q3At6fHFq2BdKyGk7uCLIrKhw&oe=634439E1"
                    }
                  ],
                  "template_type": "generic"
                }
              }
        }
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": body
    }, (err, res, body) => {
        if (!err) {
             console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook
};
// git add .
// git commit -m "first commit39"
// refresh push