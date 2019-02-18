
Meteor.publish('groupQuiz', function(selector, options) {
    return GroupQuiz.find(selector, options);
});

Meteor.publish('groupQuizData', function(selector, options) {
    return GroupQuizData.find(selector, options);
});