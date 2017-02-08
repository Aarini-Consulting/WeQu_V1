if(Meteor.isClient){

    Template.scriptLoginInit.onCreated(function () {


      var condition = Session.get('loginLinkedin') ? true : Meteor.user().emails[0].verified ;

      if(Meteor.user() && condition ){

          Meteor.call('gen-question-set', Meteor.userId(), function (err, result) {
            console.log('gen-question-set', err, result);
            setLoginScript('quiz');
        });        
      }

  });

    Template.scriptLoginInit.events({

        'click .resend-verification-link' ( event, template ) {
            var userId = Meteor.userId();
            if(userId)
            {
                Meteor.call( 'sendVerificationLink', userId, ( error, response ) => {
                  if ( error ) {
                    $('#error').text(err.reason);
                } else {
                    var email = Meteor.user().emails[ 0 ].address;
                    $('#info').text(`Verification sent to ${ email }!`, 'success');
                }
                });
            }
        }

    });

}


if(Meteor.isClient){
    Template['scriptLoginAfterQuiz'].events({ 
        "click #next" : function () {
            setLoginScript('profile');
        }
    });
    Template['profile'].events({
        "click #finish" : function(){
            setLoginScript('invite');
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
    Template['invite'].events({
        "click #next" : function () {
            return setLoginScript('finish');
        }
    });
}

if(Meteor.isServer){
    Meteor.methods({
        'gen-question-set' : function (userId) {
            check(Meteor.userId(), String);
            var user = Meteor.users.findOne({_id : userId});
            var name = userId;
            var qset;
            if(userId == Meteor.userId()) {
                qset = genInitialQuestionSet("You", qdata.type1you, 13);
                console.log("you");
            } else if(user && user.profile){
                qset = genQuizQuestionSet(getUserName(user.profile));
            }

            console.log(qset);

            Feedback.upsert({
                'from': Meteor.userId(),
                'to': userId
            }, {
                'from': Meteor.userId(),
                'to': userId,
                'qset': qset,
                'done': false,
            });
            return qset;
        }
    });
};
