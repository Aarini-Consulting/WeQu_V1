

Template.settings.events({
    "click #logout" : function(){
          Meteor.logout();
          Router.go('/signIn');
       }
});