      normalView = new ReactiveVar(true);
      
      Template.menu.created = function () {
        
      }

      Template.menu.helpers ({
        loggedIn: function(){
          return !Meteor.userId();
        }
      });

      Template.menu.events({
        "click #logout" : function(){
          Meteor.logout();
          Router.go('/profile');
        },

        "click #quiz" : function(){
          quizPerson.set(Meteor.userId());
        },

        "click #changeView" : function(event,template){
        if (normalView.get()){
          normalView.set(false);  
          step.set('default');
        }
        else{
          normalView.set(true);        
          step.set('default');
        }
        
        /*Meteor.call('addRoleGameMaster', Meteor.userId() , function (err, result) {
        }); */
      }
      
    });