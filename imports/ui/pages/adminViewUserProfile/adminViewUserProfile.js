
Template.adminViewUserProfile.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe("feedback");
	});
});

Template.adminViewUserProfile.helpers({

 profile(){
  let user = Meteor.users.findOne({_id : this.userId});
  if(user && user.profile){
   return user.profile;
 }
 return null;
}, 

displayRadar(){
 
 var id = this.userId;
 let user = Meteor.users.findOne({_id : id});
 if(user){

  let userId = user._id;
  var myfeedback = Feedback.find({ 'from': userId , 'to' : userId }).fetch();
  var data = { profile : user.profile };
  data.myscore = calculateScore(joinFeedbacks(myfeedback));

  var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
  var qset = joinFeedbacks(otherFeedback);

  var validAnswers = _.filter(qset, function(question) { return question.answer });
  data.otherscore = calculateScore(qset);
  data.enoughData = (validAnswers.length > 30);

  _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()));

  return data;
}


return null;

},


displaySkills(){
  
            // Replacing userId with custom Id
            var id = this.userId;
            let user = Meteor.users.findOne({_id : id});
            if(user){

              let userId = user._id;
              var myfeedback = Feedback.find({ 'from': userId, 'to' : userId }).fetch();
              var data = { profile : user.profile };
              data.userId = userId;
              data.myscore = calculateScore(joinFeedbacks(myfeedback));
             // var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
              var otherFeedback = Feedback.find({'to' : userId }).fetch();
              var qset = joinFeedbacks(otherFeedback);
              var validAnswers = _.filter(qset, function(question) { return question.answer });
              var otherscore = calculateScore(qset,true);
              data.enoughData = (validAnswers.length > 1);

              data.categories = _.map(_.keys(framework), function(category) {
               return {
                 name : i18n[category],
                 category : category,
                 skills : _.map(framework[category], function(skill){
                   var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                   if(otherscore.total[skill] > 0) {
                     data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                   }
                   return data;
                 })
               }
             })
              _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()))  
              return data; 
            }

            return null;
          }


        });


Template.adminViewUserProfile.events({


});
