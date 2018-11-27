// import { Meteor } from 'meteor/meteor';

// const { google } = require('googleapis');
// var getAccessToken = () => {
//     return new Promise(function(resolve, reject) {
//         var key = require('/wetime-firebase-service-account.json');
//         var jwtClient = new google.auth.JWT(
//         key.client_email,
//         null,
//         key.private_key,
//         "https://www.googleapis.com/auth/firebase.messaging",
//         null
//         );
//         jwtClient.authorize(function(err, tokens) {
//         if (err) {
//             reject(err);
//             return;
//         }
//         resolve(tokens.access_token);
//         });
//     });
// }

// Meteor.methods({
//     'update.selected.group' : function (groupId) {
//         if(this.userId){
//             Meteor.users.update({_id: this.userId},
//                 {$set: {
//                     'lastSelectedGroupId' : groupId,
//                 } 
//             });
//         }
//     },
//     'update.mobile' : function (countryCode, msisdn) {
//         if(this.userId){
//             Meteor.users.update({_id: this.userId},
//                 {$set: {
//                     'mobile' : [{'countryCode':countryCode, 'number':msisdn, 'verified':true}],
//                 } 
//             });
//         }
//     },
//     'update.deviceToken' : function (deviceToken) {
//         if(this.userId){
//             Meteor.users.update({_id: this.userId},
//                 {$set: {
//                     'devices' : [{'deviceToken':deviceToken}],
//                 } 
//             });
//         }
//     },
//     'send.push.notification' : async function () {
//         var token = await getAccessToken();
//         console.log("OAUTH TOKEN");
//         console.log(token);
//         this.unblock();

//         var bodyText ="Click me plssss!";
//         var titleText = "Call of WeTime";

//         var body = JSON.stringify({
//             "message":{
//                 "notification" : {
//                     "body" : bodyText,
//                     "title" : titleText,
//                 },
//                 "data" : {
//                     "body" : bodyText,
//                     "title" : titleText,
//                     "testPayload1" : "KAB-500L",
//                     "testPayload2" : "R-73M"
//                 },
//                 "android":{
//                     "priority":"high"
//                 },
//                 "token" : "chAlXP25Sdc:APA91bG1232F6OIS8bSXFXeyGc2_QW3zhMME8Vazc1TO_1bU2vPBIrZJONAP-tGs65A7yAmGrxAEWWoWKe2jHOgjTYKLBVL1Hl0elUn2oWLLLMziDec-lBdPvBdFfbYs1hDmQhm4cyQL",
//             }
//         });
             
//         try{
//             console.log("HTTP call");
//             var result = HTTP.call( 'POST', 'https://fcm.googleapis.com/v1/projects/wetime-10a2d/messages:send', 
//             {
//                 headers: {
//                     "Content-type": "application/json",
//                     "Authorization":`Bearer ${token}`,
//                 },
//                 content: body
                
//             });
//             console.log(result);
//             return result;
//         }
//         catch(error){
//             return error;
//         }
//     },
//     'send.verification.sms' : function (countryCode, phoneNumber) {
//         if(this.userId){
//             try{
//                 HTTP.call( 'POST', 'https://api.authy.com/protected/json/phones/verification/start', 
//                 {
//                     data: {
//                         api_key: Meteor.settings.private.twillioVerificationApiKey,
//                         via: 'sms',
//                         phone_number: phoneNumber,
//                         country_code: countryCode
//                         }
//                 });
//                 return true;
//             }
//             catch(e){
//                 console.log(e);
//                 return false;
//             }

//         }else{
//             throw new Meteor.Error("user undefined");
//         }
//     },
//     'verify.number' : function (countryCode, phoneNumber, verificationCode) {
//         if(this.userId){
//             try{
//                 var result = HTTP.call( 'GET', 'https://api.authy.com/protected/json/phones/verification/check', 
//                 {
//                     params: {
//                         api_key: Meteor.settings.private.twillioVerificationApiKey,
//                         verification_code: verificationCode,
//                         phone_number: phoneNumber,
//                         country_code: countryCode
//                         }
//                 });
//                 if(result && result.data && result.data.success){
//                     Meteor.call('update.mobile',countryCode, phoneNumber);
//                 }
//                 return true;
//             }
//             catch(e){
//                 console.log(e);
//                 return false;
//             }

//         }else{
//             throw new Meteor.Error("user undefined");
//         }
//     },
//     'send.sms.invitation' : function (msisdn, link) {
//         if(this.userId){
//             check(link, String);
//             if(link.startsWith('https://wetime.page.link/')){
//                 var message=`Oh boy, looks like somebody wants you to join WeTime:${link}`
//                 try{
//                     HTTP.call( 'POST', `https://api.twilio.com/2010-04-01/Accounts/${Meteor.settings.private.twillioNotificationAccountSid}/Messages.json`, 
//                     {
//                         params: {
//                             To: msisdn,
//                             From: Meteor.settings.private.twillioNotificationSenderMsisdn,
//                             Body: message,
//                         },
//                         auth:`${Meteor.settings.private.twillioNotificationAccountSid}:${Meteor.settings.private.twillioNotificationAuthKey}`
//                     });
//                     return true;
//                 }
//                 catch(e){
//                     console.log(e);
//                     return false;
//                 }
//             }else{
//                 throw new Meteor.Error("malformed link");
//             }
//         }else{
//             throw new Meteor.Error("user undefined");
//         }
//     },
// });