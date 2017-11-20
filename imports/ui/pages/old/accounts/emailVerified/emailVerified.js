import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './emailVerified.html';

    Template.emailVerified.events({

        'click .resend-verification-link' ( event, template ) {
            console.log("resend-verification-link");
            event.preventDefault();
            var userId = Meteor.userId();
            if(userId)
            {
                $('#info').text('Please wait , processing ');  
                Meteor.call( 'sendVerificationLink', userId, ( error, response ) => {
                  if ( error ) {
                    console.log(error,response);
                    $('#error').text(error);
                } else {
                    var email = Meteor.user().emails[ 0 ].address;
                    $('#info').text(`Verification sent to ${ email }!`, 'success');
                }
            });
                setTimeout(function () {                           
                    $('#info').text('');               
                }, 20000); 

            }
        }

    });


