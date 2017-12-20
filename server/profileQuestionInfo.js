Meteor.methods({

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
    let b = Feedback.find({to: Meteor.userId(),done:true, from: { '$ne': Meteor.userId() }})
    var count=0;

    if(b.count()>0){
      b.forEach(function (data) {
       qset = data.qset;
       qset.forEach(function (dat) {
        if(!isNaN(dat.answer)  && !!dat.answer){
          count++;
        }
      });
     });
    }

    let a = Feedback.find({to: Meteor.userId(), done:false, from: { '$ne': Meteor.userId() } });
    var idx=0;

    if(a.count()>0){
      a.forEach(function (data) {
       qset = data.qset;
       qset.forEach(function (dat) {
        if(!isNaN(dat.answer)  && !!dat.answer){
          idx++;
        }
      });
     });
    }

    idx = idx+count;
    return idx;
  }

});