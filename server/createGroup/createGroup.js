Meteor.methods({
  'createGroup' : function (groupName,data,arr_emails) {
    console.log(groupName , data, arr_emails);
    
    let groupId = Group.insert({groupName: groupName , data:data,  emails:arr_emails , creatorId: Meteor.userId()});

    if(!groupId){
     throw (new Meteor.Error("group_creation_failed")); 
   }

   Meteor.call('genGroupQuestionSet', arr_emails , groupId , data, groupName, (err, result)=> {
    //  console.log("genGroupQuestionSet" , err, result);
      if(err){ return err}
      else{
        var link; 
        for (var i = 0; i < arr_emails.length; i++) {

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
      }
    });

    return true;

  },

  'genGroupQuestionSet' : function (arr_emails , groupId , data, groupName) {

  // Creating questions for Group members (Existing Users)
  var i , j , user , user2 , arr_emails_notExisting = [] , arr_emails_existing =[];

    try{

        arr_emails.filter(typeOfUser); // Filtering existing members
        function typeOfUser(email){
          user = Meteor.users.findOne({$or : [ {"emails.address" : email  }, { "profile.emailAddress" : email }]} );
          if (user) {
            arr_emails_existing.push(email);
          }
          else{
            arr_emails_notExisting.push(email)
          }
        };


        // #77 create user up front for arr_emails_notExisting 

       Meteor.call('genGroupUserUpFront',  arr_emails_notExisting , data, groupName, function (err, result) {
        console.log("genGroupUserUpFront" , err, result);
        if(err){ return err};
      });



      // Updating two new fields -> new users , existings users in group collection
      
      var groupUpdateId = Group.update({_id: groupId} ,
             { $set: {"arr_emails_existing": arr_emails_existing,
                      "arr_emails_notExisting": arr_emails_notExisting } } ); 
      console.log(groupUpdateId, " Group Update with category of emails success \n");


     // arr_emails  = arr_emails_existing;

        //TODO : Directly use user instead email , Code Optimization

        for (i = 0; i < arr_emails.length; i++) {

          for (j = 0; j < arr_emails.length; j++) {            

            if(i != j){
              user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i]  }, { "profile.emailAddress" : arr_emails[i] }]} );
              user2 = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[j]  }, { "profile.emailAddress" : arr_emails[j] }]} );

              var name = getUserName(user2.profile);
              var gender_result = user2.profile && user2.profile.gender ? user2.profile.gender : "He"

              if (gender_result  == 'Male'){
                qset = genInitialQuestionSet(name, qdata.type1he, 12);
              } else if (gender_result  == 'Female') {
                qset = genInitialQuestionSet(name, qdata.type1she, 12);
              }
              else{
                qset = genInitialQuestionSet(name, qdata.type1he, 12);
              }
              var _id = Random.secret();
              
              var fbId = Feedback.insert({_id: _id, from : user._id , to: user2._id , qset : qset,
                                           invite : false, done: false ,
                                           groupName: groupName
                                          });
              console.log(" \n Feedback id \n ", fbId );

         }

       }
     }

     }
      catch(e){
        console.log("error in creating questions for group members")
        throw (new Meteor.Error("empty_group_creation_questions"));
      }

      return true;

    }

  });

