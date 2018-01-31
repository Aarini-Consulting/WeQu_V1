import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './publicUser.html';

Template.publicUser.onCreated(function(){
	  var self = this;
	  self.autorun(function() {
	    self.subscribe("feedback","allData");
	  });
})


Template.publicUser.helpers({
	profile() {

		let userId = Router.current() && Router.current().params.userId;
		let user =  Meteor.users.findOne({_id: userId });  
		if(user){
			return user.profile;
		}
		return null;
	},

	data(){
		var id = Router.current() && Router.current().params.userId;
		let user = Meteor.users.findOne({_id : id});
		if(user){

			let userId = user._id;
			var myfeedback = Feedback.find({ 'from': userId, 'to' : userId }).fetch();
			var data = { profile : user.profile };
			data.userId = userId;
			data.myscore = calculateScore(joinFeedbacks(myfeedback));
			var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
			var qset = joinFeedbacks(otherFeedback);
			var validAnswers = _.filter(qset, function(question) { return question.answer });
			data.otherscore = calculateScore(qset);
			data.enoughData = (validAnswers.length > 30);

               //var feedbacks = Feedback.find().fetch();
                var feedbacks = Feedback.find({$or : [ {from : Meteor.userId()}, {to : Meteor.userId()} ]}).fetch();

                var friends =  _.chain(feedbacks).map(function(feedback){
                	return [feedback.from, feedback.to];
                }).flatten().uniq().sortBy().value();

                friends = Meteor.users.find( {_id : {$in : friends}},{ profile : 1}).map(function(user){
                	return user._id;
                });
                data.friends = friends;

                if(friends.indexOf(quizPerson.get()) < 0) {
                	quizPerson.set(friends[0]);
                }
                
                if(user) data.person = user.profile;
                data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
                data.prevPerson = (friends.indexOf(quizPerson.get()) > 0);

                _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()));

                return data; 
            }
            return null;
        }

});