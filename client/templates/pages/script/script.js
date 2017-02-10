Template['scriptLoginAfterQuiz'].events({ 
        "click #next" : function () {
            setLoginScript('profile');
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