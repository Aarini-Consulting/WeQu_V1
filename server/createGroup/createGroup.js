Meteor.methods({
  'createGroup' : function (groupName,language="en",data,arr_emails) {
    var now = new Date();

    var gmCheck = Roles.userIsInRole( Meteor.userId(), 'GameMaster' );

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

    //create user in db as necessary
    Meteor.call('genGroupUserUpFront',  arr_emails, undefined, data);

    //get users from email
    var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();
    var userIds = users.map( (user) => user._id);

    //get group quiz list
    var groupQuiz = GroupQuiz.find().fetch();

    var groupQuizIdList = []

    if(groupQuiz.length >= 1){
      groupQuizIdList = groupQuiz.map((gq)=>{return gq._id});
    }

    //create group
    let groupId = Group.insert({
      groupName: groupName,  
      userIds:userIds,
      groupLanguage:language,
      creatorId: Meteor.userId(),
      isActive:false,
      isFinished:false,
      groupQuizIdList:groupQuizIdList
    });

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

    //create user's self rank feedback
    users.forEach(function(user, index, _arr) {
      Meteor.call( 'generate.self.rank', user._id, groupId);
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
  
      let body = Meteor.call('getGroupInviteHtmlTemplate', emailData, language);
      
      // console.log("sending mail to: "+ d.email);
      Meteor.call('sendEmail', d.email, subject, body, function (err, result) {
        if(err){ return err};
      });
    })

    return true;
  }
});

