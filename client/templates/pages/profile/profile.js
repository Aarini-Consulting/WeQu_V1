  Template['profile'].events({
        "click #finish" : function(){
            setLoginScript('invite');
            Router.go('/profile');
        }
  });

  Template.profile.helpers({
  	profile(){
  		return Meteor.user().profile;
  	}
  })