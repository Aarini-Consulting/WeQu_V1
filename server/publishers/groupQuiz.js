
Meteor.publish('groupQuiz', function(selector, options) {
    return GroupQuiz.find(selector, options);
});

Meteor.publish('groupQuizResult', function(selector, options) {
    return GroupQuizResult.find(selector, options);
});