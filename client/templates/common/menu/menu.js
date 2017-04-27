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


        "click #changeView" : function(event,template){
        if (normalView.get()){
          normalView.set(false);          
        }
        else{
          normalView.set(true);        
        }
        /*Meteor.call('addRoleGameMaster', Meteor.userId() , function (err, result) {
        }); */
      }
      
    });