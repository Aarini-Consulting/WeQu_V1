Meteor.methods({

	genGroupUserUpFront(arr_emails, data, groupName, groupId){

		// var copiedData = [];
		// data.forEach(function (user) {
        //    index =  arr_emails.findIndex(x => x == user.email );
        //    if(index!=-1){
        //      copiedData.push(data[index]);
        //    }
        // })

        // data = copiedData;

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

			username = Random.id();
			email = arr_emails[i];
			toName = data[i].name;

			userId = Accounts.createUser({
				username: username,
				email: email,
				password: _id,
				trialMember: true,
				trial: true,
				firstName: data[i].firstName,
				lastName: data[i].lastName,
				profile : { emailAddress : email, name: toName, gender: gender, inviteGender: gender_result }
			});
			// link = `group-invitation/${email}/${_id}`;   


			// inserting the inforamtion into the connections collection

			// Connections.upsert({
			// 	userId:userId,
			// 	inviteId : Meteor.userId(),
			// 	groupId: groupId,
			//   },
			//   {$set: {
			// 	email: email,
			// 	userId : userId,
			// 	groupId: groupId,
			// 	inviteId : Meteor.userId(),
			// 	services : {invitationId: _id}
			//   }    
			// });
			/* ----------   verfiy this one   ----------------------- */
		    // Connections.insert({username: toName,
		    //   email: email,
		    //   password: _id,
		    //   userId : userId,

		    //   //inviteId : Meteor.userId(), conflicts normal invite so using creatorId
		    //   creatorId: Meteor.userId(),
		    //   services : {invitationId: _id},
		    //   profile : { emailAddress : email, name: toName, gender: gender, inviteGender: gender_result,
		    //               trialMember: true} // not referred trialMember here
		    // });

		    Meteor.users.update({_id: userId}, {$set : { "services.invitationId": _id }});

		    // Updating the profile groupQuizPerson to true
		    let flag = true;
		    Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
		            console.log("updateProfileGroupQuizPerson",err,result);
		    }); 
		    /* -------it should not affect any other normal logic ---------------- */

		    
			// var subject = `[WeQu] Inviting for joining ${groupName}` ;
			// var message = `Please join the group by clicking the invitation link ${link}`

			// var emailData = {
			// 	'from': '',
			// 	'to' : '',
			// 	'link': Meteor.absoluteUrl(link),
			// 	'groupName': groupName
			// };

			// let body = SSR.render('GroupInviteHtmlEmail', emailData);

			// Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
			// 	if(err){ return err};
			// });

		   }


	// 	   for (i = 0; i < data.length; i++) {

    //         for (j = 0; j < data.length; j++) {            

    //           if(i != j){
    //             user = Meteor.users.findOne({$or : [ {"emails.address" : data[i].email  }, { "profile.emailAddress" : data[i].email }]} );
    //             user2 = Meteor.users.findOne({$or : [ {"emails.address" : data[j].email }, { "profile.emailAddress" : data[j].email }]} );

    //             var name = getUserName(user2.profile);
    //             gender_result = user2.profile && user2.profile.gender ? user2.profile.gender : "He"

    //             if (gender_result  == 'Male'){
	// 								qset = genInitialQuestionSet(data[i].firstName, qdata.type1he, 12);
	// 							} else if (gender_result  == 'Female') {
	// 								qset = genInitialQuestionSet(data[i].firstName, qdata.type1she, 12);
	// 							}
	// 							if (gender  == 'Male'){
	// 								qset1 = genInitialQuestionSet(toName, qdata.type1he, 12);
	// 							} else if (gender  == 'Female') {
	// 								qset1 = genInitialQuestionSet(toName, qdata.type1she, 12);
	// 							}

	// 										var _id = Random.secret();


	// 										if(!qset){
	// 											throw new Meteor.Error("qset undefined");
	// 										}

	// 										var fbId = Feedback.insert({_id: _id, from : user._id , to: user2._id , qset : qset,
	// 																								invite : false, done: false ,
	// 																								groupName: groupName,
	// 																								groupId: groupId,
	// 																								});
	// 									console.log(" \n Feedback id genGroupUserUpFront \n ", fbId );
	// 							}

    //      }
    //    }
       	

	}

});