    Template.scriptLoginInit.onCreated(function () {

      var data = Feedback.findOne({to: Meteor.userId(), from: Meteor.userId()});

      if(Meteor.user() && !data){

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