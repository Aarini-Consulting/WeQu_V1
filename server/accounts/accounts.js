

//Account related methods 

Meteor.methods({

	createAccount: function(data, emailVerification=true){
		var userId;
		var verification = emailVerification;
		var checkUser = Meteor.users.findOne({"emails.address" : data.registerEmail});
		if(checkUser && checkUser.profile.trial){
			verification = false;
			userId = checkUser._id;
			Accounts.setPassword(checkUser._id, data.registerPassword);
			Meteor.call('updateProfileFromTrial', data);
		}else{
			userId = Accounts.createUser({
				email: data.registerEmail,
				password: data.registerPassword,
				firstName: data.firstName,
				lastName: data.lastName,
				profile:{consentSubs:{consentGiven:data.consentSubs, lastUpdated:new Date()}}
			}); 
		}

		if(userId) {
			if(verification){
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