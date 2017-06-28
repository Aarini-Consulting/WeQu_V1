Template.userTile.created = function () {
    this.result = new ReactiveVar();  
};

Template.userTile.onCreated(function(){
    var self = this;
    self.autorun(function() {
      self.subscribe("createGroup");
      self.subscribe("feedback","allData");
    });
})
  
Template.userTile.helpers({

    displayRadar(){

      let data = Template.instance().result.get();
      if(data){
        return data;
      }        
      return null;
    },
    // Not reactive because of using common functions ..
    allUserTile(){
      let gId = groupId.get();
      if(gId)
      {
       let users=[];
       let himselfAnswered = [];
       let user,userId,email,q1=0,q2=0;
       let dr, tw;

       let data = Group.find({_id: gId },  {
            transform: function (doc) {
                 emails = doc.emails;
                 emails.forEach(function (post) {
                 user = Meteor.users.findOne({$or : [ {"emails.address" : post  }, { "profile.emailAddress" : post}]} )
                 if(user){
                  userId = user._id;
                  q1 = questionHimselfAnswered(userId);
                  user.himselfAnswered = q1;
                  q2 = questionInviteesAnsweredHim(userId);
                  user.inviteesAnsweredHim =q2;
                  dr = displayRadar(userId);
                  user.radarData = dr;
                  ds = displaySkills(userId);
                  user.skillsData = ds;
                  tw = calculateTopWeak(Feedback.find({to: userId }).fetch());
                  user.topWeak = tw;
                  users.push(user);
                  console.log(user);
                  }
                 });
                 
                 doc.allUsers = users; 
                 
                 return doc;
               }
             }).fetch();
       console.log(data);
       return data;
      }
    }
  });

questionHimselfAnswered = (userId) => {
    console.log(userId);
    let count = Feedback.find({from: userId, to: userId, done:true}).count();
    count = count*12;
    console.log(count);
    var a = Feedback.findOne({from: userId, to: userId, done:false});
    var idx = 0;
    if(a){
      _.find(a.qset, function (question) {
        idx++;
        console.log(idx);
        return !_.has(question, 'answer');
      });
      idx--;
    }

    idx = idx+count;
    return idx;
}
  Template.userTile.rendered = function () {

    let template = Template.instance();

    Meteor.subscribe('feedback');

    if(Router.current().params.userId){
      quizPerson.set(Router.current().params.userId);
    }

    //Re-write as a function - Re-use it

    Tracker.autorun(function () {

      let handle = Meteor.subscribe('feedback');

      if(handle.ready() && Accounts.loginServicesConfigured())
      {
            // Replacing userId with custom Id
            var id = quizPerson.get();
            let user = Meteor.users.findOne({_id : id});
            if(user){

              let userId = user._id;
              var myfeedback = Feedback.find({ 'from': userId, 'to' : Meteor.userId() }).fetch();
              var data = { profile : user.profile };
              data.userId = userId;
              data.myscore = calculateScore(joinFeedbacks(myfeedback));
              var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
              var qset = joinFeedbacks(otherFeedback);
              var validAnswers = _.filter(qset, function(question) { return question.answer });
              data.otherscore = calculateScore(qset);
              data.enoughData = (validAnswers.length > 30);

                //Profile should have carousal to navigate to other users profile


                //Temporary ------- Sorting not works because of this

                var feedbacks = Feedback.find().fetch();
                var friends =  _.chain(feedbacks).map(function(feedback){
                  return [feedback.from, feedback.to];
                }).flatten().uniq().sortBy().value();

                friends = Meteor.users.find( {_id : {$in : friends}},{ profile : 1}).map(function(user){
                  return user._id;
                });
                data.friends = friends;
                // Temporary Ends -----------

                if(friends.indexOf(quizPerson.get()) < 0) {
                  quizPerson.set(friends[0]);
                }



                var user = Meteor.users.findOne({_id : userId});
                if(user) data.person = user.profile;
                data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
                data.prevPerson = (friends.indexOf(quizPerson.get()) > 0);               

                _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch())) 

                template.result.set(data);

              }

            }
          });

  }

