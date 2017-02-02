

//Account related methods 

Meteor.methods({

	createAccount: function(data){
		 var result = Accounts.createUser({
			email: data.registerEmail,
			password: data.registerPassword,
			firstName: data.firstName,
			lastName: data.lastName
		 }); 

		  Meteor.setTimeout(function() {

		  	Meteor.call( 'sendVerificationLink', result, ( error, response ) => {
                    if ( error ) {
                        console.log( error.reason, 'danger' );
                    } else {
                        console.log( 'Welcome!', 'success' );
                    }
                });

		  },3000);

		 return result;
    },
    
    //Creating a method to send verification.
    sendVerificationLink(result) {
	   	return Accounts.sendVerificationEmail( result );
  	}


})