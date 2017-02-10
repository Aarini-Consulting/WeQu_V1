    Template.scriptInvitationFillData.onCreated(function(){
        var user = Meteor.user()
        if(user && user.profile && user.profile.firstName && user.profile.pictureUrl) {
            finishInviteScript();
        }
    });

    Template.scriptInvitationFillData.events({
        "click button" : function(){
            Meteor.loginWithLinkedin({});
        }
    });

    Template.scriptInviteInit.onCreated(function () {
        var invitationId = Session.get('invitation-id');
        Meteor.call('inviteLogin', invitationId, function(err, username){
            console.log("invite login result", err, username);
            if(username){
                Meteor.loginWithPassword(username, invitationId);
            }
            Session.setPersistent('invite', 'quiz');
        });
    });