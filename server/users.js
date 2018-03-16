// Meteor.publish('user', (userId) => {
//   return  Meteor.users.find({_id : userId});
// });

// Meteor.publish('users', function () {
//   return Meteor.users.find({});  
// });


Meteor.publish('users', function(selector, options) {
  return Meteor.users.find(selector, options);
});


Meteor.methods({
  'store.profile.picture'(base64String) {
    Meteor.users.update(Meteor.userId(), { 
      '$set': {
          'profile.pictureUrl': base64String,
          'profile.pictureShape': "square"
          } 
      });
  },
})
