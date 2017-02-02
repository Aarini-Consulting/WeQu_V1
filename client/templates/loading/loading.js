Template.loading.events({

        'click .resend-verification-link' ( event, template ) {
            Meteor.call( 'sendVerificationLink', ( error, response ) => {
              if ( error ) {
                console.log( error.reason, 'danger' );
            } else {
                var email = Meteor.user().emails[ 0 ].address;
                console.log( `Verification sent to ${ email }!`, 'success' );
            }
        });
        }

    });
