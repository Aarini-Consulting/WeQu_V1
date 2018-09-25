import { Meteor } from 'meteor/meteor';

Meteor.methods({
    //Creating a method to send verification.
    'send.notification'() {
        this.unblock();
        var body = JSON.stringify({
            "notification": {
            "message": "test-message",
            "title": "teri ma ki",
            "text": "this is for testing from meteor"
            },
            "to" : "dtty1XR36Wo:APA91bFdsV5IpMcYIdgBdo22yD-emvqMCknwdPUIFd56txF4LvaUcd6ZVeTzEUE3N1uJc-YJliyeKrC8GxfquomlRM47SfE0qDaNnd_rtJagzxaX64k9IksxNfIGNZAo1k8J_gww26At"
        });

             
        try{
            var result = HTTP.call( 'POST', 'https://fcm.googleapis.com/fcm/send', 
            {
                headers: {
                    "Content-type": "application/json",
                    "Authorization":"key=AAAADWCOb_Y:APA91bFhDKg6qTbE4FCQqwBCZAx22IJ_Mj7jisPL6WW4kRl4soieyI4dx0GJVSsfAWCXWv6bQxDvqN8sI2063iddOGzro1yHK4LSy17gpji_a6_qLvJdtsqDxUTDNxq3MZTO4_lqtElZ",
                },
                content: body
                
            });

            return result;
        }
        catch(error){
            return error;
        }
        
    },
})