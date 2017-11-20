import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './scriptInvitationFillData.html';

 Template.scriptInvitationFillData.onCreated(function(){
  var user = Meteor.user()
  if(user && user.profile && user.profile.firstName && user.profile.pictureUrl) {
    finishInviteScript();
  }
});

 Template.scriptInvitationFillData.created = function () {

  let invitationId = Router.current().params._id;

  Tracker.autorun(function(){
    Meteor.subscribe('invitation', invitationId);
  })

  this.invitationId = new ReactiveVar(invitationId);

  this.emailId = new ReactiveVar('');

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

  'click .loginLinkedin' : function(event,template){

    Meteor.loginWithLinkedin(function(err,result){

        if(err == "Error: User validation failed [403]"){ // TODO: Improve with bootbox.js implementation later

          let email= template.emailId.get();
          let invitationId = template.invitationId.get();
          var user =  Meteor.users.findOne({'services.invitationId' : invitationId });
          var password; var newAcc; 
          if(user){
            password = user.services.invitationId;
            newAcc = false;
          }
          else{
            password = prompt("Please enter your wequ password", "");
            newAcc = true;
          }

          if (!password) {
            $('#error').text("Please provide wequ to continue");             
          }
          else
          {
            Meteor.loginWithPassword(email,password, function (err) {
              if(err){
                $('#error').text(err);
              }
              else
              {
                Session.set('loginLinkedin', true);
                Session.clear('invite');
                Router.go('/quiz');
              }
            });
          }
        }

        if(err){
          $('#error').text(err);
        }

        else
        {
          Session.set('loginLinkedin', true);
          Session.clear('invite');          //  setLoginScript("init");

          Router.go('/quiz');

          Meteor.setTimeout(function () {
            try{ // production issue ..
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
        }


      })
  }

})
