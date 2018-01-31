Meteor.publish('user', (userId) => {
  return  Meteor.users.find({_id : userId});
});

Meteor.publish('users', function () {
  return Meteor.users.find({});  
});