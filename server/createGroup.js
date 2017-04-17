  Meteor.methods({
  	'createGroup' : function (groupName,arr_emails) {
  		console.log(groupName , arr_emails);
  		let groupId = Group.insert({groupName: groupName , emails:arr_emails });
  		var data, index , i , link; 

  		for (i = 0; i < arr_emails.length; i++) {
  			data = Meteor.users.findOne( {"email":arr_emails[i]} );
  			if (data) {
  				link = `signIn/groupInvitation/existingUser/${arr_emails[i]}/${groupId}`;
  			}
  			else{
  				link = `signIn/groupInvitation/newUser/${arr_emails[i]}/${groupId}`
  			}

  			var subject = `Inviting for group joining ${groupName}` ;
  			var message = `Please join the group by clicking the invitation link ${link}`

  			Meteor.call('sendEmail', arr_emails[i], subject, message, function (err, result) {
  				console.log(err, result);
  				if(err){ return err};
  			});
  		}
  		
  		return true;

  	}
  });