Template['scriptLoginAfterQuiz'].events({
        "click #next" : function () {
            
            let email = Meteor.user().profile.emailAddress || Meteor.user().emails[0].address;
            let oldUser = Connections.findOne(  {"email":email} );
            let exists = !oldUser ? false : true;
            let condition = getLoginScript() == false ; // Already activated then do nothing
            if(exists || condition){
              setLoginScript(false); // Invited user then activate the profile .
            }
            else
            {
               setLoginScript('profile');
            }
            Router.go('/profile'); 
           
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
