

//Account related methods 

Meteor.methods({

	createAccount: function(data){
		var userId = Accounts.createUser({
			email: data.registerEmail,
			password: data.registerPassword,
			firstName: data.firstName,
			lastName: data.lastName
		}); 
		if(userId) {
			Meteor.call( 'sendVerificationLink', userId, ( error, response ) => {
				if ( error ) {
					console.log( error );
				} else {
					console.log( 'Welcome!', 'success' );
				}
			});
	
			var stampedLoginToken = Accounts._generateStampedLoginToken();
			Accounts._insertLoginToken(userId, stampedLoginToken);
			return stampedLoginToken;
		}
		else{
			return false;
		}
		
	},

    //Creating a method to send verification.
    sendVerificationLink(userId) {
    	return Accounts.sendVerificationEmail( userId );
    },

    verifiedTrue(userId){
    	return	Meteor.users.update({_id : userId}, {$set: {"emails.0.verified" :true}});
    },

    setPassword(userId,newPassword){
   		 return Accounts.setPassword(userId, newPassword);
	}


})