Template.profileSkills.helpers({
      data() {
		
             // Replacing userId with custom Id
            var id = quizPerson.get();
            let user = Meteor.users.findOne({_id : id});

            if(user)
            {

            let userId = user._id;
            var data = { profile : user.profile };
            data.userId = userId;
            var otherFeedback = Feedback.find({ 'to' : userId }).fetch();
            var joinedQset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(joinedQset, function(question) { return question.answer });
            var otherscore = calculateScore(joinedQset, true);
            data.enoughData = (validAnswers.length > 9);

            return data;
            }
      }
});