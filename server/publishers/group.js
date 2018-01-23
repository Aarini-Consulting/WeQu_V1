//  Meteor.publish("group", function(){
//           //  if(this.userId) {
//                 return Group.find();                
//           //  }
//           //  this.ready();
// });

Meteor.publish('group', function(selector, options) {
      return Group.find(selector, options);
});