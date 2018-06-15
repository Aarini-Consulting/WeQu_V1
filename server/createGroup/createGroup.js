Meteor.methods({
  'createGroup' : function (groupName,data,arr_emails) {
    var now = new Date();
    
    let groupId = Group.insert({groupName: groupName,  emails:arr_emails , creatorId: Meteor.userId(),isActive:false, isFinished:false});

    if(!groupId){
     throw (new Meteor.Error("group_creation_failed")); 
    }

    var groupCreator = Meteor.users.findOne(Meteor.userId());

    var group = Group.findOne(groupId);

    var subject = `[WeQ] Group Creation`;

    var emailData = {
        'creatorEmail': groupCreator.emails[0].address,
        'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
        'groupId': group._id,
        'groupName': group.groupName
    };
    var body;
    body = SSR.render('GroupCreationEmail', emailData);
    

    Meteor.call('sendEmail', "contact@weq.io", subject, body);

  //  FeedbackCycle.insert({
  //   'groupId': groupId, 
  //   'creatorId': Meteor.userId(), 
  //   'from': now
  //   });

   Meteor.call('genGroupQuestionSet', arr_emails , groupId , data, groupName);

    return true;

  },

  'genGroupQuestionSet' : function (arr_emails , groupId , data, groupName) {

  // Creating questions for Group members (Existing Users)
    var i , j , user , user2 , arr_emails_notExisting = [] , arr_emails_existing =[], dataEmailNotExisting=[];
    let groupCheck = Group.findOne({'_id': groupId});
    
    if(!groupCheck){
        throw (new Meteor.Error("unknown_group")); 
    }

    let groupCreator = Meteor.users.findOne({'_id':groupCheck.creatorId});
    
    if(!groupCheck){
        throw (new Meteor.Error("group_creator_missing")); 
    }

    try{
        data.forEach((d)=>{
          user = Meteor.users.findOne({$or : [ {"emails.address" : d.email  }, { "profile.emailAddress" : d.email }]} );
          if (user) {
            arr_emails_existing.push(d.email);
          }
          else{
            arr_emails_notExisting.push(d.email);
            dataEmailNotExisting.push(d);
          }

          var link = `group-invitation/${d.email}/${groupId}`
      
          var subject = `[WeQ] Invitation to join the group "${groupName}"` ;
          var message = `Please join the group by clicking the invitation link ${link}`
      
          var emailData = {
            'creatorEmail': groupCreator.emails[0].address,
            'link': Meteor.absoluteUrl(link),
            'firstName':d.firstName,
            'groupName': groupName
          };
      
          let body = SSR.render('GroupInviteHtmlEmail', emailData);
		      console.log("sending mail to: "+ d.email);
          Meteor.call('sendEmail', d.email, subject, body, function (err, result) {
            if(err){ return err};
          });
        })


        // #77 create user up front for arr_emails_notExisting 
       if(arr_emails.length > 0){
        Meteor.call('genGroupUserUpFront',  arr_emails , data, groupName, groupId, function (err, result) {
          console.log("genGroupUserUpFront" , err, result);
          if(err){ return err};
        });
       }


      // Updating two new fields -> new users , existings users in group collection
      
      // var groupUpdateId = Group.update({_id: groupId} ,
      //        { $set: {"arr_emails_existing": arr_emails_existing,
      //                 "arr_emails_notExisting": arr_emails_notExisting } } ); 
      // console.log(groupUpdateId, " Group Update with category of emails success \n");


     // arr_emails  = arr_emails_existing;

        //TODO : Directly use user instead email , Code Optimization


        //assign groupmember's connection and feedback question with each other
    //     for (i = 0; i < arr_emails.length; i++) {

    //       for (j = 0; j < arr_emails.length; j++) {            

    //         if(i != j){
    //           user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i]  }, { "profile.emailAddress" : arr_emails[i] }]} );
    //           user2 = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[j]  }, { "profile.emailAddress" : arr_emails[j] }]} );
    //           //check if feedback already exist
    //           var check = Feedback.findOne({from : user._id , to: user2._id,groupId:groupId});
    //           var checkConnection = Connections.findOne({inviteId : user._id , userId: user2._id,groupId:groupId});

    //           if(!check){
    //             var name = getUserName(user2.profile);
    //             var gender_result = user2.profile && user2.profile.gender ? user2.profile.gender : "He"

    //             if (gender_result  == 'Male'){
    //               qset = genInitialQuestionSet(name, qdata.type1he, 12);
    //             } else if (gender_result  == 'Female') {
    //               qset = genInitialQuestionSet(name, qdata.type1she, 12);
    //             }
    //             else{
    //               qset = genInitialQuestionSet(name, qdata.type1he, 12);
    //             }
    //             var _id = Random.secret();

    //             var fbId = Feedback.insert({_id: _id, from : user._id , to: user2._id , qset : qset,
    //               invite : false, done: false ,
    //               groupName: groupName,
    //               groupId:groupId
    //              });

    //              if(!checkConnection){
    //               Connections.insert( {
    //                 email: user2.emails[0].address,
    //                 userId : user2._id,
    //                 groupId: groupId,
    //                 inviteId : user._id,
    //                 services : {invitationId: _id} 
    //               });
    //              }

    //              console.log(" \n Feedback id \n ", fbId );
    //           }
    //      }

    //    }
    //  }

       //create user's self rank feedback
       var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();

      users.forEach(function(user, index, _arr) {
        Meteor.call( 'generate.self.rank', user._id, groupCheck._id, (error, result)=>{
          if(error){
            console.log(error);
          }
        });
      });

     }
      catch(e){
        console.log(e);
        console.log("error in creating questions for group members")
        throw (new Meteor.Error("empty_group_creation_questions"));
      }

      return true;

    }

  });

