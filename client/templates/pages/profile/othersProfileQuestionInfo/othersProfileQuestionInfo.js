
Template.othersProfileQuestionInfo.onCreated(function() {
	var self = this;
	self.autorun(function() {
	//	self.subscribe("feedback","allData");
	});
});


Template.othersProfileQuestionInfo.helpers({
	questionHimselfAnswered() {

		Meteor.call('questionHimselfAnswered', quizPerson.get() , function (err, result) {
   		  Session.set('questionHimselfAnswered', result);
   		  return result;
   		});
   		return Session.get('questionHimselfAnswered');

	},
	questionIAnsweredHim(){

		Meteor.call('questionIAnsweredHim', quizPerson.get() , function (err, result) {
   		  Session.set('questionIAnsweredHim', result);
   		  return result;
   		});
   		return Session.get('questionIAnsweredHim');

	},
	questionInviteesAnsweredHim(){

		Meteor.call('questionInviteesAnsweredHim', quizPerson.get() , function (err, result) {
   		  Session.set('questionInviteesAnsweredHim', result);
   		  return result;
   		});
   		return Session.get('questionInviteesAnsweredHim');
		
	}
});