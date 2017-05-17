Meteor.methods({
  'genGroupQuestionSetNewUser' : function(currentGroup, currentUserEmail){


    //Allow only once , then update the group collection 
    // since only once questions , should be generated

     try{

        var arr_emails = currentGroup.arr_emails_existing;

        var data , qset , qset1 ;

        for (i = 0; i < arr_emails.length; i++) {

         if(arr_emails[i] != currentUserEmail ){

           user1 = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i]  }, { "profile.emailAddress" : arr_emails[i] }]} );

           user2 = Meteor.users.findOne({$or : [ {"emails.address" : currentUserEmail  }, { "profile.emailAddress" : currentUserEmail }]} );

           
           var name1 = getUserName(user1.profile);
           var gender_result1 = user1.profile && user1.profile.gender ? user1.profile.gender : "He"

           if (gender_result1  == 'Male'){
            qset1 = genInitialQuestionSet(name1, qdata.type1he, 12);
          } else if (gender_result1  == 'Female') {
            qset1 = genInitialQuestionSet(name1, qdata.type1she, 12);
          }
          else{
            qset1 = genInitialQuestionSet(name1, qdata.type1he, 12);
          }

          var name2 = getUserName(user2.profile);
           var gender_result2 = user2.profile && user2.profile.gender ? user2.profile.gender : "He"

           if (gender_result2  == 'Male'){
            qset2 = genInitialQuestionSet(name2, qdata.type1he, 12);
          } else if (gender_result2  == 'Female') {
            qset2 = genInitialQuestionSet(name2, qdata.type1she, 12);
          }
          else{
            qset2 = genInitialQuestionSet(name2, qdata.type1he, 12);
          }

          var _id = Random.secret();
          var _id2 = Random.secret();
          if(!qset1 || !qset2){
            throw new Meteor.Error("qset undefined");
          }
          const {groupName} = currentGroup;

          var fbId = Feedback.insert({_id: _id, from : user1._id , to: user2._id , qset : qset2, invite : false, done: false , groupName: groupName});
          var fbId1 = Feedback.insert({_id: _id2, from : user2._id , to: user1._id , qset : qset1, invite : false, done: false ,groupName: groupName});
        }
      }
    }
    catch(e){
      throw new Meteor.Error("Error Create questions for Group members during new group user signup ");
    }
    finally{
      emails =  currentGroup.arr_emails_notExisting;
      let index = emails.indexOf(currentUserEmail);
      if (index > -1) {
         emails.splice(index, 1);
      }
      let emails2 = [];
      emails2 = currentGroup.arr_emails_existing;
      emails2.push(currentUserEmail);
      Group.update({_id:currentGroup._id}, 
                   {$set:{arr_emails_notExisting: emails , arr_emails_existing: emails2 } } ); 
    }

  }

});