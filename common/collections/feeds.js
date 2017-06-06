
// For storing the feeds

Feeds = new Mongo.Collection("feeds");

FeedsSchema = new SimpleSchema({
    "id": {
        type: String,
        label: "Id of Meteor user",
        optional: true,
        autoValue: function() {
            if ( this.isInsert) {
              return Meteor.userId();
            }
          }
    },
    "type":{
    	type: Number, // 0 - onboard , 1- answers
    	label: "type"
    },
    "inviteId":{
        type: String,
        label: "inviteId",
        optional:true // since applicable only for invited user on boarding
    },
    "statement1":{
        type: String,
        label: "comment",
    },
    "statement2":{
        type: String,
        label: "comment",
        optional: true // remove this after completing the statement 
    },
    "statement3":{
        type: String,
        label: "comment",
        optional: true // remove this after completing the statement 
    },
    
    "createdAt": {
        type: Date,
        autoValue: function() {
            if ( this.isInsert ) {
              return new Date();
            }
          }
    },
    "updatedAt": {
        type: Date,
        optional: true,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        }
    }

});


Feeds.attachSchema(FeedsSchema);

if (Meteor.isClient) {
    Meteor.subscribe("feeds");
}


//For testing purpose

Feeds.allow({
  'insert': function () {
   return true;
 },
 'update':function () {
   return true;
 },
 'remove': function () {
   return true;
 }
})