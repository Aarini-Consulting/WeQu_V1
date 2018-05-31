//  Meteor.publish("group", function(){
//           //  if(this.userId) {
//                 return Group.find();                
//           //  }
//           //  this.ready();
// });

Meteor.publish('feedbackRank', function(selector, options) {
    return FeedbackRank.find(selector, options);
});