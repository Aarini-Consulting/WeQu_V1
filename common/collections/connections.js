
// For storing the invitee users 

Connections = new Mongo.Collection("connections");

ConnectionsSchema = new SimpleSchema({
  "email":{
    type: String,
    label: "email"
  },
  "userId":{
    type: String,
    label: "userId"
  },
  "inviteId":{
    type: String,
    label: "inviteId"
  },
  "groupId":{
    type: String,
    label: "groupId",
    optional: true,
  },
  "services":{
    type: Object,
    label: "services",
    optional: true,
  },
  "creatorId": {
      type: String,
      label: "creator",
      optional: true,
      autoValue: function() {
          if (this.isInsert) {
              return Meteor.userId();
          } 
      }
  },

  "createdAt": {
    type: Date,
    label: "Date group created",
    optional: true,
    autoValue: function() {
      if ( this.isInsert ) {
        return new Date;
      }
    }
  },
  "updatedAt": {
    type: Date,
    label: "Date group updated",
    optional: true , 
    autoValue: function() {
      if ( this.isUpdate || this.isUpsert ) {
        return new Date;
      }
    }
  },


})

Connections.attachSchema(ConnectionsSchema);

  // Connections.allow({
  //   'insert': function () {
  //    return true;
  //  },
  //  'update':function () {
  //    return true;
  //  },
  //  'remove': function () {
  //    return true;
  //  },
  // })