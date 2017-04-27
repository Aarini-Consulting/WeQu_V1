      normalView = true;
      if (Roles.userIsInRole( Meteor.userId(), "GameMaster" ) ){
        normalView = false;
      }     
      normalView = new ReactiveVar(normalView);

      Template.menu.created = function () {
        
      }

      Template.menu.helpers ({
        loggedIn: function(){
          return !Meteor.userId();
        },
        normalView(){
          return normalView.get(); 
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