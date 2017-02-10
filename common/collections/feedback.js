Feedback =  new Mongo.Collection('feedback');



if (Meteor.isClient) {
    Meteor.subscribe("feedback");
}