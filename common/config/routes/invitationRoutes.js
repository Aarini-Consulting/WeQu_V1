  Router.route('/invitation/:_id', function () {

        this.layout('ApplicationLayout');

        this.wait(Meteor.subscribe('invitation', this.params._id));
        if(!this.ready()){
            this.render('loading');
            return;
        }
        var feedback = Feedback.findOne({_id : this.params._id});
        if(feedback && feedback.done) {
            sAlert.warning("Already completed",{timeout: '3000', onRouteClose: false});
            Router.go(`/script-invitation/${this.params._id}`)
            Session.set('invite',"filldata")
            return;
        }
        Session.setPersistent('invitation-id', this.params._id);
        if(feedback){
            //var user = Meteor.users.findOne({_id : feedback.from});
            var user = Meteor.user();
            if(user && user.profile && user.profile.pictureUrl) {
                quizPerson.set(feedback.to);
                Router.go('/quiz')
                return;
            }
        }
        //Session.setPersistent('invite', 'init');
        Session.set('invite', 'init');

        Router.go(`/script-invitation/${this.params._id}`);

    }, { 'name': '/invitation/:_id' });


    Router.route('/script-invitation/:_id?', function () {

        this.layout('ApplicationLayout');

        this.wait(Meteor.subscribe('invitation', this.params._id));

        let invitationId =  this.params._id;

        switch(Session.get('invite')) {
            case 'init': {
                this.render("scriptInviteInit")
                return;
            }
            case 'quiz': {
                this.wait(Meteor.subscribe('invitation', invitationId));
                if(!this.ready()){
                    this.render('loading');
                    return;
                }
                var data = { feedback: Feedback.findOne({_id : invitationId}) };
                if(!data.feedback) {
                    this.render("error", {data : { message: "No such invitation " + invitationId}});
                    setTimeout(function(){
                        finishInviteScript();
                    }, 3000)
                    return;
                }
                var user = Meteor.users.findOne({_id : data.feedback.to});
                if(!user) {
                    this.render("error", {data : { message: "No such user"}});
                    setTimeout(function(){
                        finishInviteScript();
                    }, 3000)

                    return;
                }

                data.person = user.profile;
                this.render('quiz', { 'data': data });
                return;
            }
            case 'filldata':{
                this.render('scriptInvitationFillData');
                return;
            }
        }

        this.render("error", {data : { message: "Unkonwn invitation script state: " + Session.get("invite")}});
       
       /* setTimeout(function(){
            finishInviteScript();
        }, 5000)
       */


    }, { 'name': '/script-invitation' });

    function finishInviteScript(){
        if(Session.get('invite')) {
            Session.clear('invite');
        }
        Router.go('/');
    }
