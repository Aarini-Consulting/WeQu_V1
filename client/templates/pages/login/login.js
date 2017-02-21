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