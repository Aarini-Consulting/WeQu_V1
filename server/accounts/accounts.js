

//Account related methods 

Meteor.methods({

	createAccount: function(data, emailVerification){
		var userId = Accounts.createUser({
			email: data.registerEmail,
			password: data.registerPassword,
			firstName: data.firstName,
			lastName: data.lastName
		}); 
		if(userId) {
			if(emailVerification){
				Meteor.call( 'sendVerificationLink', userId);
			}
			else{
				Meteor.call('verifiedTrue', userId);
			}
			
	
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