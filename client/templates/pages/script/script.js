Template['scriptLoginAfterQuiz'].events({
        "click #next" : function () {
            
            let email = Meteor.user().profile.emailAddress || Meteor.user().emails[0].address;
            let oldUser = Connections.findOne(  {"email":email} );
            let exists = !oldUser ? false : true;
            if(exists){
              setLoginScript(false); // Invited user then activate the profile .
            }
            else if(getLoginScript() == false) { 
                return Router.go('/profile'); // Already activated then do nothing
            }
            else
            {
                setLoginScript('profile');
            }
           
        }
    });


    Template.scriptLoginFail.events({
        "click button" : function(){
            Meteor.call("reset", function(){
                setLoginScript('init');
                Router.go("/");
            })
        }
    });
    Template['scriptLoginFinish'].events({
        'click #next' : function () {
            setLoginScript(false);
            return Router.go('/quiz');
        }
    });
