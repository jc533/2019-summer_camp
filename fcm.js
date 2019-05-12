// var request = require('request');

// module.exports = {
//     send: function(msg) {
//         request.post({
//             url:'https://fcm.googleapis.com/fcm/send',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'key='
//             },
//             json: {
//                 "notification": {
//                     "title": "New Register!",
//                     "body": msg
//                 },
//                 "condition": "!('TopicA' in topics)"
//             },
//             encoding:'utf8'
//         }, function(error, response, body) {
//             if(response.statusCode == 200){
//                 console.log(body);
//             }else{
//                 console.log(response.statusCode);
//             }
//         });
//     }
// }