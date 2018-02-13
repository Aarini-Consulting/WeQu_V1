// Meteor.publish('user', (userId) => {
//   return  Meteor.users.find({_id : userId});
// });

// Meteor.publish('users', function () {
//   return Meteor.users.find({});  
// });


Meteor.publish('users', function(selector, options) {
  return Meteor.users.find(selector, options);
});