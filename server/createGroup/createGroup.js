import {sendEmail, getGroupInviteHtmlTemplate} from '../emailNotifications';
import { generateSelfRank } from '../category';

import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';

export function genGroupUserUpFront(arr_emails, arr_numbers, data){
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

Meteor.methods({
  'createGroup' : function (groupName,language="en",data,arr_emails,type) {
    var now = new Date();
    
    var gmCheck = Roles.userIsInRole( this.userId, 'GameMaster' );

    var groupNameCheckOwn = Group.findOne({groupName : groupName, creatorId:this.userId});

    var groupNameCheckOthers = Group.findOne({groupName : groupName, creatorId:{'$ne':this.userId}});

    if(groupNameCheckOwn){
      throw (new Meteor.Error(`group_name_"${groupName}"_already_exist`)); 
    }

    if(groupNameCheckOthers){
      throw (new Meteor.Error("group_name_already_claimed_by_other_CMC")); 
    }

    if(!gmCheck){
      throw (new Meteor.Error("only_gamemaster_can_create_group")); 
    }

    if(!Array.isArray(arr_emails)){
      throw (new Meteor.Error("invalid_parameter_emails_not_array"));
    }

    if(Array.isArray(arr_emails) && arr_emails.length < 2){
      throw (new Meteor.Error("need_at_least_2_players"));
    }

    if(type != "short" && type != "long"){
      throw (new Meteor.Error("invalid_type"));
    }

    //create user in db as necessary

    genGroupUserUpFront(arr_emails, undefined, data);

    //get users from email
    var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();
    var userIds = users.map( (user) => user._id);

    //get group quiz list
    var groupQuiz = GroupQuiz.find().fetch();

    var groupQuizIdList = []

    if(groupQuiz.length >= 1){
      var groupQuizQuestionForShort = ["HowOftenCompliment","BestComplimentGiver","BestCriticismGiver","RankBehaviourImprovement","EvaluateSession"]
      var groupQuizIdListShort = [];

      groupQuizIdList = groupQuiz.map((gq)=>{
        if(groupQuizQuestionForShort.indexOf(gq.question) > -1){
          groupQuizIdListShort.push(gq._id);
        }
        return gq._id
      });

      if(type == "short"){
        groupQuizIdList = groupQuizIdListShort;
      }
    }

    //create group
    let groupId = Group.insert({
      groupName: groupName,  
      userIds:userIds,
      groupLanguage:language,
      creatorId: this.userId,
      isActive:false,
      isFinished:false,
      groupQuizIdList:groupQuizIdList,
      groupType:type
    });

    if(!groupId){
     throw (new Meteor.Error("group_creation_failed")); 
    }

    var groupCreator = Meteor.users.findOne(this.userId);

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
    
    sendEmail("contact@weq.io", subject, body);

    //create user's self rank feedback
    users.forEach(function(user, index, _arr) {
      generateSelfRank(user._id, groupId)
    });

    data.forEach((d)=>{
      var link = `group-invitation/${d.email}/${groupId}`
  
      var subject = `[WeQ] Invitation to join the group "${groupName}"` ;
      var message = `Please join the group by clicking the invitation link ${link}`
  
      var emailData = {
        'creatorEmail': groupCreator.emails[0].address,
        'link': Meteor.absoluteUrl(link),
        'groupName': groupName
      };
  
      let body = getGroupInviteHtmlTemplate(emailData, language);
      
      // console.log("sending mail to: "+ d.email);

      sendEmail(d.email, subject, body);
    })

    return true;
  }
});

