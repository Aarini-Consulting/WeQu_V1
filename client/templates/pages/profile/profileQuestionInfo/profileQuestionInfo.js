
Template.profileQuestionInfo.helpers({

  questionIAnswered(){

      let count = Feedback.find({from: Meteor.userId(), to: Meteor.userId(),done:true}).count();
      count = count*12;
      var a = Feedback.findOne({from: Meteor.userId(), to: Meteor.userId(), done:false});
      var idx = 0;
      if(a){
      _.find(a.qset, function (question) {
        idx++;
        return !_.has(question, 'answer');
       });
       idx--;
      }
      
      idx = idx+count;
      return idx;
    },

    questionInviteesAnswered(){
      let count = Feedback.find({to: Meteor.userId(),done:true, from: { '$ne': Meteor.userId() }}).count();
      count = count*12;
      var a = Feedback.findOne({to: Meteor.userId(), done:false, from: { '$ne': Meteor.userId() } });
      var idx = 0;
      if(a){
       _.find(a.qset, function (question) {
        idx++;
        return !_.has(question, 'answer');
       });
      idx--;
      }
      idx = idx+count;
      return idx;
    }

});