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