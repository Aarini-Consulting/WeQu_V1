
Template.othersProfileQuestionInfo.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe("feedback","allData");
	});
});


Template.othersProfileQuestionInfo.helpers({
	questionHimselfAnswered() {
		let userId = quizPerson.get();	
		let count = Feedback.find({from: userId, to: userId, done:true}).count();
		count = count*12;
		var a = Feedback.findOne({from: userId, to: userId, done:false});
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
	questionIAnsweredHim(){

		let userId = quizPerson.get();	
		var b = Feedback.find({from: Meteor.userId(), to: userId,done:true});
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

		var a = Feedback.findOne({from: Meteor.userId(), to: userId, done:false});
		var idx = 0;
		if(a){
			qset = a.qset;
			qset.forEach(function (data) {
				if(!isNaN(data.answer)  && !!data.answer){
					idx++;
				}
			});
		}

		idx = idx+count;
		return idx;
	},
	questionInviteesAnsweredHim(){

		let userId = quizPerson.get();
		let b = Feedback.find({to: userId,done:true, from: { $nin: [ userId , Meteor.userId() ] }  })
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


	    var a = Feedback.findOne({to: userId, done:false, from: { $nin: [ userId , Meteor.userId() ] } });
	    var idx = 0;
	    if(a){
	    	qset = a.qset;
	    	qset.forEach(function (data) {
	    		if(!isNaN(data.answer)  && !!data.answer){
	    			idx++;
	    		}
	    	});
	    }

	    idx = idx+count;
	    return idx;
	}
});