  Template['profile'].events({
        "click #finish" : function(){
            setLoginScript('invite');
            Router.go('/profile');
        }
  });

  // Due to Reactivity issues , the graph is not loading properly 

  // Business logic should not be in routes.js 

  // Moving it into helpers 

  Template.profile.helpers({

  	data(){
  		var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: true});
  		if(myfeedback){
  		var data = calculateTopWeak([myfeedback]);
        data.myscore = calculateScore(myfeedback.qset);
        data.profile = Meteor.user().profile;
        console.log(data);
        return data;
        }
        return null;
    }

  })