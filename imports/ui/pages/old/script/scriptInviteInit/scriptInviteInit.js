import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './scriptInviteInit.html';

    Template.scriptInviteInit.onCreated(function () {


        let invitationId = Router.current().params._id;

        Meteor.call('inviteLogin', invitationId, function(err, username){
            console.log("invite login result", err, username);
            if(username){
                Meteor.loginWithPassword(username, invitationId);
            }
            Session.setPersistent('invite', 'quiz');
        });
    });