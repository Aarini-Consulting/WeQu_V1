Meteor.methods({
    'updateGroup' : function (group,arr_emails) {
        
    let check = Group.findOne({_id:group._id});
    
    if(!check){
     throw (new Meteor.Error("group doesn't exist")); 
   }

   
   let groupId = group._id;

   var data, index , i , j , link; 

   for (i = 0; i < arr_emails.length; i++) {
    //  user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i] }, { "profile.emailAddress" : arr_emails[i] }]} );
    //  if (user) {
    //   link = `signIn/groupInvitation/${arr_emails[i]}/${groupId}`;
    //   if(user && user.services && user.services.linkedin){
    //     link = `signIn/groupInvitationLinkedinUser/${arr_emails[i]}/${groupId}`;
    //   }
    // }
    // else{
    //   link = `signUp/groupInvitation/${arr_emails[i]}/${groupId}`
    // }

    link = `group-invitation/${arr_emails[i]}/${groupId}`

    var subject = `[WeQu] Inviting for joining ${groupName}` ;
    var message = `Please join the group by clicking the invitation link ${link}`

    var emailData = {
      'from': '',
      'to' : '',
      'link': Meteor.absoluteUrl(link),
      'groupName': groupName
    };

    let body = SSR.render('GroupInviteHtmlEmail', emailData);

    Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
      if(err){ return err};
    });
  }

    // TODO : Use the filtered isExisting user arr_emails .

    Meteor.call('genGroupQuestionSet', arr_emails , groupId , groupName, function (err, result) {
    //  console.log("genGroupQuestionSet" , err, result);
    if(err){ return err};
  });

    return true;

  }

  });

