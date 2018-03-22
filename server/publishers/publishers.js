
Meteor.publish("connections", function(selector, options){
        return Connections.find(selector, options);                
});

Meteor.publish('feedback', function(selector, options) {
    return Feedback.find(selector, options);
});

Meteor.publish('feedback_cycle', function(selector, options) {
    return FeedbackCycle.find(selector, options);
});

Meteor.publish('invitation', function (id) {
    var fb = Feedback.findOne(id);
    if(!fb) { return [] }
    return [
        Feedback.find(id),
        Meteor.users.find({ '_id': fb.to }, { 'fields': { 'profile': 1 } })
    ];
});