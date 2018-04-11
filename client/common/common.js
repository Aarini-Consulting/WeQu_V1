getLoginScript =  function getLoginScript() {
  if(Meteor.user())
    return Meteor.user().profile.loginScript;
};
setLoginScript =  function setLoginScript(value) {
  Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': value } });
};

dataForRadar =  function dataForRadar(score, width) {
  var radius = 120;
  var center = 150;
  if(width){
    center = width/2;
    radius = center - 30;
  }
  var vertices = _.keys(framework)['length'];
  var i = 0;
  return _.object(_.map([
    'VIRTUE',
    'SELF_MANAGEMENT',
    'COMMUNICATION',
    'TEAMWORK',
    'LEADERSHIP',
    'PROBLEM_SOLVING',
    ], function (key) {
      var len = score[key];
      var angle = Math.PI * 0.5 + i * (2 * Math.PI / vertices);
      i = 1 + i;
      return [
      key,
      Math.round(center + Math.cos(angle) * radius * len) + ',' + Math.round(center + Math.sin(angle) * radius * len)
      ];
    }));
};


finishInviteScript = function() {                                                                                    
  if (Session.get('invite')) {                                                                                   
    Session.clear('invite');                                                                                   
  }                                                                                                              
  Router.go('/');                                                                                                
} 


currentEmail = function currentEmail(id){
  let user;
  if(id){
   user = Meteor.users.findOne({_id: id});  
 }
 else
 {
  user = Meteor.users.findOne({_id: Meteor.userId()});  
}

if(user){
  currentEmail = ( user.emails && user.emails[0].address ) 
  || user.profile.emailAddress
  return currentEmail;
}
return null;
}

getpictureUrl = function(data){
  let qp = quizPerson.get()
  if(data){
    qp = data;
  }

  let userId = qp ? qp :  Meteor.userId();
  var user = Meteor.users.findOne({_id : userId });
  let url =  user && ( user.services && user.services.linkedin
    && user.services.linkedin.pictureUrl );
  if(url){
    return url;  
  }
  return null;    
}

//ES6 Function
// Not really used anywhere
capitalizeFirstLetter = (string) => {
 return string.charAt(0).toUpperCase() + string.slice(1);
}


questionHimselfAnswered = (userId) => {
  let count = Feedback.find({'from': userId, 'to': userId, 'done':true}).count();
  count = count*12;
  var a = Feedback.findOne({'from': userId, 'to': userId, 'done':false});
  var idx = 0;
  if(a){
    _.find(a.qset, function (question) {
      idx++;
      return !_.has(question, 'answer');
    });
    idx--;
  }

  idx = idx+count;
  return idx;
}


questionInviteesAnsweredHim = (userId, groupId) => {

  let b;
  if(groupId){
    b = Feedback.find({'groupId':groupId, 'to': userId,'done':true, 'from': { $nin: [ userId , Meteor.userId() ] }  });
  }else{
    b = Feedback.find({'to': userId,'done':true, 'from': { $nin: [ userId , Meteor.userId() ] }  });
  }
  var count=0;
  if(b.count()>0){
    b.forEach(function (data) {
      qset = data.qset;
      qset.forEach(function (dat) {
        if(!isNaN(dat.answer)  && !!dat.answer){
          count++;
        }
      });
    });
  }

  var a;
  if(groupId){
    a = Feedback.findOne({'groupId':groupId,'to': userId, 'done':false, 'from': { $nin: [ userId , Meteor.userId() ] } });
  }else{
    a = Feedback.findOne({'to': userId, 'done':false, 'from': { $nin: [ userId , Meteor.userId() ] } });
  }
  
  var idx = 0;
  if(a){
    qset = a.qset;
    qset.forEach(function (data) {
      if(!isNaN(data.answer)  && !!data.answer){
        idx++;
      }
    });
  }

  idx = idx+count;
  return idx;
}


displayRadar = (userId) => {

  let user = Meteor.users.findOne({_id : userId});
  if(user){

    let userId = user._id;
    var myfeedback = Feedback.find({ 'from': userId , 'to' : userId }).fetch();
    var data = { profile : user.profile };
    data.myscore = calculateScore(joinFeedbacks(myfeedback));

    var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
    var qset = joinFeedbacks(otherFeedback);

    var validAnswers = _.filter(qset, function(question) { return question.answer });
    data.otherscore = calculateScore(qset);
    data.enoughData = (validAnswers.length > 30);

    _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()));

    return data;
  }


  return null;

}


displaySkills = (userId) =>{

  let user = Meteor.users.findOne({_id : userId});
  if(user){

    let userId = user._id;
    var myfeedback = Feedback.find({ 'from': userId, 'to' : userId }).fetch();
    var data = { profile : user.profile };
    data.userId = userId;
    data.myscore = calculateScore(joinFeedbacks(myfeedback));
    var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
    var qset = joinFeedbacks(otherFeedback);
    var validAnswers = _.filter(qset, function(question) { return question.answer });
    var otherscore = calculateScore(qset,true);
    data.enoughData = (validAnswers.length > 9);

    data.categories = _.map(_.keys(framework), function(category) {
      return {
        name : i18n[category],
        category : category,
        skills : _.map(framework[category], function(skill){
          var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
          if(otherscore.total[skill] > 0) {
            data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
          }
          return data;
        })
      }
    })
    _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()))  

    return data; 
  }

  return null;
}

formatDate = (val) => {
  if (val) {
      let day = moment().dayOfYear() - moment(val).dayOfYear(); // gives number of days 
      // Writing custom logic for calculating days , weeks 
      if(day > 7){
          let week =  parseInt(day / 7) ;

          if(week > 4 )
          {
              let month =  parseInt(week / 4) ;
              return `${month}m`
          }

          return `${week}w`;
      }
      if(day == 0){
          day++;    
      }
      return `${day}d`;


  }
  return null;
}
