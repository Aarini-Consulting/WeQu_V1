 Template.scriptInvitationFillData.onCreated(function(){
    var user = Meteor.user()
    if(user && user.profile && user.profile.firstName && user.profile.pictureUrl) {
        finishInviteScript();
    }
});

 Template.scriptInvitationFillData.created = function () {

        // Avoid session and get the invitation id using the url
        let invitationId = Router.current().params._id;

        Tracker.autorun(function(){
            Meteor.subscribe('invitation', invitationId);
        })

        this.invitationId = new ReactiveVar(invitationId);

        this.emailId = new ReactiveVar('');

       /*   Meteor.call("removeAccounts", Meteor.userId(), function(err, result){
                console.log("remove accounts", err, result);
          }); */

          let user =  Meteor.users.findOne({'services.invitationId' : invitationId });
          if(user){
              let userId = user._id;
              Meteor.call("updateTrialUser", userId , function(err, result){
                        console.log("updateTrialUser", err, result);
              });
          }
    }

    Template.scriptInvitationFillData.helpers({

        data(){
            let invitationId = Template.instance().invitationId.get();
            let data;

            if(invitationId){
                var feedback = Feedback.findOne({_id : invitationId})
                if(feedback){
                    data =  calculateTopWeak([feedback]);
                    data.person = Meteor.users.findOne({_id : feedback.to}) && Meteor.users.findOne({_id : feedback.to}).profile;
                    let connection = Connections.findOne({userId : feedback.from});

                    if(connection){
                    let email = connection.profile.emailAddress;
                    data.profile = connection.profile;
                    Template.instance().emailId.set(email);
                    }

                }
                return data;
            }
            return null;
        }

    });


    Template.scriptInvitationFillData.events({

        'click .font-white':function(event,template){
            event.preventDefault();                        

            let email= template.emailId.get();
            let invitationId = template.invitationId.get();
            setLoginScript('init');
            Meteor.logout();
            Router.go(`/signUp/invited/${email}/${invitationId}`);
        },
         'click .loginLinkedin' : function(){
              Meteor.loginWithLinkedin(function(err,result){
                if(err)
                 $('#error').text(err);
               else
                Session.set('loginLinkedin', true);
                    //  setLoginScript("init");
                     Router.go('/quiz');

                      Meteor.setTimeout(function () {
                                  try{
                                    // production issue ..
                                    if(Meteor.user() && Meteor.user().services){

                                      const {firstName, lastName}  = Meteor.user().services.linkedin;
                                      Meteor.users.update({_id: Meteor.userId()},
                                        {$set : { "profile.firstName": firstName, "profile.lastName": lastName }});
                                    }
                                  }
                                  catch(e){
                                    console.log(e);
                                  }
                                }, 1000);


                    })
        }

    })
