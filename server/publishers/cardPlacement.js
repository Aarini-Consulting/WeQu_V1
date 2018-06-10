Meteor.publish('cardPlacement', function(selector, options) {
    return CardPlacement.find(selector, options);
});