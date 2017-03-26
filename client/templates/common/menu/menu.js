

    Template.menu.helpers ({
      loggedIn: function(){
        return !Meteor.userId();
      }
    });

    Template.menu.events({
      "click #logout" : function(){
          Meteor.logout();
          Router.go('/profile');
       }
        
   });