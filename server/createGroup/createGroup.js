import {sendEmail, getGroupInviteHtmlTemplate} from '../emailNotifications';
import { generateSelfRank } from '../category';

import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';

import {groupTypeIsShort} from '/imports/helper/groupTypeShort.js';

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
    var gmCheckTrial = Roles.userIsInRole( this.userId, 'TrialGameMaster' );
    var gmCheck = (Roles.userIsInRole( this.userId, 'GameMaster' ) || gmCheckTrial);

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

    if(gmCheckTrial){
      if(type !== "norming"){
        throw (new Meteor.Error("invalid_type"));
      }
    }else if(!groupTypeIsShort(type) && type !== "long" && type !== "norming"){
      throw (new Meteor.Error("invalid_type"));
    }

    //create user in db as necessary

    genGroupUserUpFront(arr_emails, undefined, data);

    //get users from email
    var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();
    var userIds = users.map( (user) => user._id);

    //get group quiz list
    var groupQuiz = GroupQuiz.find().fetch();

    var groupQuizIdList = [];
    var playCardTypeList = [];

    

    if(groupQuiz.length >= 1){
      let filteredGroupList;
      let specialGroupQuizList;
      let questionToIdMap={};

      groupQuiz.forEach((gq)=>{
        questionToIdMap[gq.question] = gq._id;
      });

      if(type === "norming"){
        specialGroupQuizList = ["TeamSharedGoal","RankDiscussionBehaviour","RankBehaviourImprovement","EvaluateSession"];
        groupQuizIdList = specialGroupQuizList.map((question)=>{
          return questionToIdMap[question];
        });
      }
      else if(groupTypeIsShort(type)){
        if(type === "norming"){
          specialGroupQuizList = ["TeamSharedGoal","RankDiscussionBehaviour","RankBehaviourImprovement","EvaluateSession"];
          groupQuizIdList = specialGroupQuizList.map((question)=>{
            return questionToIdMap[question];
          });
        }
        else if(type === "short"){
          specialGroupQuizList = ["HowOftenCompliment","BestComplimentGiver","HadToChooseSomeonePrefer","WhenReceivingCriticism","RankBehaviourImprovement","EvaluateSession"];
          groupQuizIdList = specialGroupQuizList.map((question)=>{
            return questionToIdMap[question];
          });
          playCardTypeList = ["praise","criticism"];

        }else if(type === "short-praise"){
          specialGroupQuizList = ["HowOftenCompliment","BestComplimentGiver","RankBehaviourImprovement","EvaluateSession"];
          groupQuizIdList = specialGroupQuizList.map((question)=>{
            return questionToIdMap[question];
          });
          playCardTypeList = ["praise"];
        }
        else if(type === "short-criticism"){
          specialGroupQuizList = ["HadToChooseSomeonePrefer","WhenReceivingCriticism","RankBehaviourImprovement","EvaluateSession"];
          groupQuizIdList = specialGroupQuizList.map((question)=>{
            return questionToIdMap[question];
          });
          playCardTypeList = ["criticism"];
        }
      }else{
        specialGroupQuizList = ["HadToChooseSomeonePrefer","WhenReceivingCriticism"];
        filteredGroupList = groupQuiz.filter((gq)=>{
          return !specialGroupQuizList.includes(gq.question);
        });

        groupQuizIdList = filteredGroupList.map((gq)=>{
          return gq._id
        });
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
      playCardTypeList:playCardTypeList,
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

      var subject
      var message

      if (language.substring(0, 2) == 'es') {
          subject = `[WeQ] Invitación a unirse al grupo "${groupName}"` ;
          message = `Únase al grupo haciendo clic en el enlace de invitación ${link}`

      }else {
          subject = `[WeQ] Invitation to join the group "${groupName}"` ;
          message = `Please join the group by clicking the invitation link ${link}`
      }
  
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

