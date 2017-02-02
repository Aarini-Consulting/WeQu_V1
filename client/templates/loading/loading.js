Template.loading.events({

    'click .resend-verification-link' ( event, template ) {

        var userId=Meteor.userId();
        if(userId)
        {
            Meteor.call( 'sendVerificationLink',userId, ( error, response ) => {
              if ( error ) {
                console.log( error.reason, 'danger' );
            } else {
                var email = Meteor.user().emails[ 0 ].address;
                console.log( `Verification sent to ${ email }!`, 'success' );
            }
            });
        }
    }

});
