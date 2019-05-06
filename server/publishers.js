import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';
import {GroupQuizData} from '/collections/groupQuizData';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import {CardChosen} from '/collections/cardChosen';

Meteor.publish('cardPlacement', function(selector, options) {
    return CardPlacement.find(selector, options);
});

Meteor.publish('feedbackRank', function(selector, options) {
    return FeedbackRank.find(selector, options);
});

Meteor.publish('group', function(selector, options) {
    return Group.find(selector, options);
});

Meteor.publish('groupQuiz', function(selector, options) {
    return GroupQuiz.find(selector, options);
});

Meteor.publish('groupQuizData', function(selector, options) {
    return GroupQuizData.find(selector, options);
});

Meteor.publish('cardChosen', function(selector, options) {
    return CardChosen.find(selector, options);
});

Meteor.publish(null, function(){
    return Meteor.roles.find({});
});

Meteor.publish(null, function() {
  return Meteor.users.find();
});