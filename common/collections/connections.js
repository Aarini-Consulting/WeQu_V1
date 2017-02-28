
// For storing the invitee users 

Connections = new Mongo.Collection("connections");

if (Meteor.isClient) {
    Meteor.subscribe("connections");
}