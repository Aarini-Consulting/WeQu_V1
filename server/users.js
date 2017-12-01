Meteor.publish('users', (userId) => {
  return  Meteor.users.find({_id : userId});
});