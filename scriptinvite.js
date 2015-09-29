
if (Meteor.isClient) {
    Router.route('/invitation/:_id', function () {
        Session.setPersistent('invite', 'init');
        Session.setPersistent('invitation-id', this.params._id);
        Router.go('/script-invitation');
    }, { 'name': '/invitation/:_id' });


    Router.route('/script-invitation', function () {
        this.layout('ScriptLayout');

        switch(Session.get('invite')) {
            case 'init': {
                this.render("scriptInviteInit")
                return;
            }
            case 'quiz': {
                var invitationId = Session.get('invitation-id')
                this.wait(Meteor.subscribe('invitation', invitationId));
                if(!this.ready()){
                    this.render('loading');
                    return;
                }
                var data = { feedback: Feedback.findOne({_id : invitationId}) };
                if(!data.feedback) break;
                var user = Meteor.users.findOne({_id : data.feedback.to});
                if(!user) break;
                data.person = user.profile;
                this.render('quiz', { 'data': data });
                return;
            }
            case 'filldata':{
                if(Meteor.user()){
                    this.render('scriptInvitationFillData');
                } else {
                    this.render("loading");
                }

                return;
            }

            case 'finish' : {
                this.render('scriptInvitationFinish')
                return;
            }
        }

        Session.setPersistent('invite', false);
        if(Session.get("invitation-id"))
            Session.clear('invitation-id');
        Router.go("/");

    }, { 'name': '/script-invitation' });

    Template.scriptInvitationFillData.onCreated(function(){
        var user = Meteor.user()
        Session.setPersistent('invite', "finish");
        //TODO:
        /*if(user && user.profile && user.profile.firstName && user.profile.pictureUrl) {
            Session.setPersistent('invite', "finish");
        }*/
    });

    Template.scriptInvitationFillData.events({
        "click button" : function(){
            console.log("login with linkedin");
            console.log("Accounts", Accounts);
            Meteor.loginWithLinkedin({}, function(err){
                console.log("login with linkedin", err)
            });
        }
    });

    Template['scriptInvitationFinish'].events({
        "click button" : function () {
            Session.setPersistent('invite', false);
            Session.clear('invitation-id');
            return Router.go('/');
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
}

if(Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.publish('invitation', function (id) {
            var fb = Feedback.findOne(id);
            if(!fb) { return [] }
            return [
                Feedback.find(id),
                Meteor.users.find({ '_id': fb.to }, { 'fields': { 'profile': 1 } })
            ];
        });
    });
}
