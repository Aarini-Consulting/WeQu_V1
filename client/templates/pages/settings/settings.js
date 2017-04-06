

 Template.settings.helpers({
  	profile(){
  		return Meteor.user() && Meteor.user().profile;
  	}
  })

Template.settings.events({
    "click #logout" : function(){
          Meteor.logout();
          Router.go('/signIn');
       }
});