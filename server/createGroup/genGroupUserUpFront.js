Meteor.methods({

	genGroupUserUpFront(arr_emails, arr_numbers, data){
		if(!arr_emails && !arr_numbers){
			throw (new Meteor.Error("no user to add")); 
		}	

		var data, index , i , j , link; 

		
	    var _id = Random.secret()
	    var userId , username;
	    let gender,toName,gender_result;
		if(arr_emails && arr_emails.length > 0){
			for (i = 0; i < arr_emails.length; i++) {
				// gender_result = Meteor.user().profile.gender ? Meteor.user().profile.gender : 'Male'
				// gender= data[i].gender;

				email = arr_emails[i];

				var checkUser = Meteor.users.findOne(
					{
						$and : [ 
							{$or : [ {"emails.address" : email  }, 
								{ "profile.emailAddress" : email}
							]},
						]
					}
				);

				if(!checkUser){
					userId = Accounts.createUser({
						email: email,
						password: _id,
						trial: true,
						firstName: data[i].firstName,
						lastName: data[i].lastName,
						profile : { emailAddress : email, 
							// gender: gender, 
							// inviteGender: gender_result 
						}
					});

					// Meteor.users.update({_id: userId}, {$set : { "services.invitationId": _id }});

					// Updating the profile groupQuizPerson to true
					// let flag = true;
					// Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
					// 		console.log("updateProfileGroupQuizPerson",err,result);
					// }); 
				}

			}
		}
	}
});