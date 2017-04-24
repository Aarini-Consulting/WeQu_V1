  Meteor.methods({
  	'createGroup' : function (groupName,arr_emails) {
  		console.log(groupName , arr_emails);

  		
      // TODO : Update two new fields , new users , existings users in group collection

      // For Future referece

      let groupId = Group.insert({groupName: groupName , emails:arr_emails });


  		var data, index , i , j , link; 

  		for (i = 0; i < arr_emails.length; i++) {
  			user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i] }, { "profile.emailAddress" : arr_emails[i] }]} );
  			if (user) {
  				link = `signIn/groupInvitation/${arr_emails[i]}/${groupId}`;
  				if(user && user.services && user.services.linkedin){
            link = `signIn/groupInvitationLinkedinUser/${arr_emails[i]}/${groupId}`;
          }
        }
        else{
          link = `signUp/groupInvitation/${arr_emails[i]}/${groupId}`
        }

        var subject = `Inviting for group joining ${groupName}` ;
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

      Meteor.call('genGroupQuestionSet', arr_emails , function (err, result) {
        console.log("genGroupQuestionSet" , err, result);
        if(err){ return err};
      });

      return true;

    },

    'genGroupQuestionSet' : function (arr_emails) {

    // Creating questions for Group members (Existing Users)

      var i , j , user , user2;

      //try{
          arr_emails = arr_emails.filter(isExistingUser); // Filtering existing members

          function isExistingUser(email){
            user = Meteor.users.findOne({$or : [ {"emails.address" : email  }, { "profile.emailAddress" : email }]} );
            if (user) 
              return email;
          };

          //TODO : Directly use user instead email , Code Optimization

          for (i = 0; i < arr_emails.length; i++) {

            for (j = 0; j < arr_emails.length; j++) {            

              if(i != j){
              user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i]  }, { "profile.emailAddress" : arr_emails[i] }]} );
              user2 = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[j]  }, { "profile.emailAddress" : arr_emails[j] }]} );

              var name = getUserName(user2.profile);
              var gender_result = user2.profile && user2.profile.gender ? user2.profile.gender : "He"

              if (gender_result  == 'Male'){
                qset = genInitialQuestionSet(name, qdata.type1he, 10);
              } else if (gender_result  == 'Female') {
                qset = genInitialQuestionSet(name, qdata.type1she, 10);
              }
              else{
                qset = genInitialQuestionSet(name, qdata.type1he, 10);
              }
              var _id = Random.secret();
              if(!qset){
                  throw new Meteor.Error("qset undefined");
              }

              var fbId = Feedback.insert({_id: _id, from : user._id , to: user2._id , qset : qset, invite : true, done: false });
              console.log(fbId);
              }

            }
          }

       /* }
        catch(e){
          console.log("error in creating questions for group members")
          throw (new Meteor.Error("empty_group_creation_questions"));
        } */

        return true;

      }

});

