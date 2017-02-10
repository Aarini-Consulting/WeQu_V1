

    Template.menu.helpers ({
      route: function(status) {
        return status == route.get();
      },
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

    Template.menuProfile.helpers ({
      route: function(status) {
        return status == route.get();
      }
    });