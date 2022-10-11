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
                          "url": "https://www.onlinesabuyme.co.th/",
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
                      "image_url": "https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg",
                      "title": "Packaging A",
                      "subtitle": "Detail Packaging A",
                      "default_action": {
                        "webview_height_ratio": "full",
                        "url": "https://www.onlinesabuyme.co.th/",
                        "type": "web_url"
                      }
                    },
                    {
                      "default_action": {
                        "type": "web_url",
                        "webview_height_ratio": "full",
                        "url": "https://www.onlinesabuyme.co.th/"
                      },
                      "image_url": "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2019/9/16/0/IO_Tongue-and-Groove_Beech-Street_3.jpg.rend.hgtvcom.616.411.suffix/1568648112267.jpeg",
                      "buttons": [
                        {
                          "url": "https://www.onlinesabuyme.co.th/",
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
                        "url": "https://www.onlinesabuyme.co.th/",
                        "webview_height_ratio": "full"
                      },
                      "subtitle": "Detail Packaging C",
                      "image_url": "https://www.realestate.com.au/blog/images/2000x1500-fit,progressive/2021/11/24151024/Rawson_Facade2_2000x1500.jpg",
                      "title": "Packaging C",
                      "buttons": [
                        {
                          "title": "ขอรายละเอียด",
                          "type": "web_url",
                          "url": "https://www.onlinesabuyme.co.th/"
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
                      "image_url": "https://www.mydomaine.com/thmb/WsS7ztC01HHgJJAOxXjZUJu4u7I=/500x0/filters:no_upscale():max_bytes(150000):strip_icc():gifv()/SuCasaDesign-Modern-9335be77ca0446c7883c5cf8d974e47c.jpg",
                      "default_action": {
                        "webview_height_ratio": "full",
                        "type": "web_url",
                        "url": "https://www.onlinesabuyme.co.th/"
                      },
                      "subtitle": "Detail Packaging D",
                      "buttons": [
                        {
                          "title": "ขอรายละเอียด",
                          "type": "web_url",
                          "url": "https://www.onlinesabuyme.co.th/"
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
                          "url": "https://www.onlinesabuyme.co.th/"
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
                        "url": "https://www.onlinesabuyme.co.th/",
                        "type": "web_url",
                        "webview_height_ratio": "full"
                      },
                      "title": "Packaging E",
                      "subtitle": "Detail Packaging E",
                      "image_url": "https://i0.wp.com/www.inspiredhomes.net.au/wp-content/uploads/2022/02/IH-Bolton-Website-Home-Banner-scaled.jpg?fit=2560%2C1280&ssl=1"
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