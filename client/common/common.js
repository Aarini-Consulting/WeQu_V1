getLoginScript =  function getLoginScript() {
    if(Meteor.user())
        return Meteor.user().profile.loginScript;
};
setLoginScript =  function setLoginScript(value) {
    Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': value } });
};