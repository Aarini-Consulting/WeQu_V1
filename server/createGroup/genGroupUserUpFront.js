Meteor.methods({

	genGroupUserUpFront(arr_emails, data, groupName, groupId){
		if(!arr_emails){
			throw (new Meteor.Error("genGroupUserUpFront Failed")); 
		}	

		var data, index , i , j , link; 

		
	    var _id = Random.secret()
	    var userId , username;
	    let gender,toName,gender_result;

		for (i = 0; i < arr_emails.length; i++) {

		    gender_result = Meteor.user().profile.gender ? Meteor.user().profile.gender : 'Male'
		    gender= data[i].gender;

			email = arr_emails[i];
			toName = data[i].name;

			userId = Accounts.createUser({
				email: email,
				password: _id,
				trialMember: true,
				trial: true,
				firstName: data[i].firstName,
				lastName: data[i].lastName,
				profile : { emailAddress : email, name: toName, gender: gender, inviteGender: gender_result }
			});

		    Meteor.users.update({_id: userId}, {$set : { "services.invitationId": _id }});

		    // Updating the profile groupQuizPerson to true
		    let flag = true;
		    Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
		            console.log("updateProfileGroupQuizPerson",err,result);
		    }); 

		   }
	}

});