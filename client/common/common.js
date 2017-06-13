getLoginScript =  function getLoginScript() {
    if(Meteor.user())
        return Meteor.user().profile.loginScript;
};
setLoginScript =  function setLoginScript(value) {
    Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': value } });
};

dataForRadar =  function dataForRadar(score) {
    var radius = 120;
    var center = 150;
    var vertices = _.keys(framework)['length'];
    var i = 0;
    return _.object(_.map([
        'VIRTUE',
        'SELF_MANAGEMENT',
        'COMMUNICATION',
        'TEAMWORK',
        'LEADERSHIP',
        'PROBLEM_SOLVING'
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
