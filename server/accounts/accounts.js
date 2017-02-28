

//Account related methods 

Meteor.methods({

	createAccount: function(data,verify){
		var result = Accounts.createUser({
			email: data.registerEmail,
			password: data.registerPassword,
			firstName: data.firstName,
			lastName: data.lastName
		}); 

		if(verify){

			Meteor.setTimeout(function() {
				Meteor.call( 'sendVerificationLink', result, ( error, response ) => {
					if ( error ) {
						console.log( error.reason );
					} else {
						console.log( 'Welcome!', 'success' );
					}
				});
			},3000);

		}


		return result;
	},

    //Creating a method to send verification.
    sendVerificationLink(result) {
    	return Accounts.sendVerificationEmail( result );
    },

    verifiedTrue(userId){
    	return	Meteor.users.update({_id : userId}, {$set: {"emails.0.verified" :true}});
    }


})