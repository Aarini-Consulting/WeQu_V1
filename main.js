if (Meteor.isClient) {


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

    Template.login.rendered = function(){
        // TODO : Temporarily doing this .. verify is this way needed .
        Session.set("loginWithEmail", true);
    }

    Template.login.events({
       "click .loginEmail" : function(){
          Session.set("loginWithEmail", true);
          Router.go('/signIn');
        }
    })

    Template.login.helpers({
      loginWithEmail: function () {
        return Session.get('loginWithEmail');
      },
    });

}
