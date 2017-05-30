Template.skillCategories.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe("feedback");
	});
});

Template.skillCategories.created = function () {
	this.expand = new ReactiveVar(true);
};

Template.skillCategories.helpers({

	isExpand(){
		return Template.instance().expand.get();
	},

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

            let count = Template.instance().expand.get() ? 3 : 0;
            var i=0;
            console.log(count);
            let categories = {};
            categories = _.map(_.keys(framework), function(category) {
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
             categories.splice(0,count);
             data.categories = categories;
             return data;
		    }
       }
});


Template.skillCategories.events({
	'click .arrow': function (event,template) {
		event.preventDefault();
		if(template.expand.get())
		  template.expand.set(false);	
		else
	      template.expand.set(true);
	}
});