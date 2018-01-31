
// For storing the invitee users 

Connections = new Mongo.Collection("connections");

  Connections.allow({
    'insert': function () {
     return true;
   },
   'update':function () {
     return true;
   },
   'remove': function () {
     return true;
   },
  })