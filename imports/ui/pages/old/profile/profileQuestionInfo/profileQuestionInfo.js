<<<<<<< HEAD:client/templates/pages/profile/profileQuestionInfo/profileQuestionInfo.js
=======

/*Template.profileQuestionInfo.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe("feedback","allData");
  });
});*/
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './profileQuestionInfo.html';

>>>>>>> dev-yw:imports/ui/pages/old/profile/profileQuestionInfo/profileQuestionInfo.js
Template.profileQuestionInfo.helpers({

  questionIAnswered(){   
    Meteor.call('questionIAnswered', quizPerson.get() , function (err, result) {
        Session.set('questionIAnswered', result);
        return result;
      });
      return Session.get('questionIAnswered');
  },

  questionInviteesAnswered(){
    Meteor.call('questionInviteesAnswered', quizPerson.get() , function (err, result) {
        Session.set('questionInviteesAnswered', result);
        return result;
      });
      return Session.get('questionInviteesAnswered');
  }

});