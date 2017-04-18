Group = new Mongo.Collection("group");

GroupSchema = new SimpleSchema({
    "groupName":{
      type: String,
      label: "groupName"
    },
    "emails":{
      type: [String],
      label: "emails",
      optional: true
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
        if ( this.isUpdate ) {
          return new Date;
        }
      }
    },


})

Group.attachSchema(GroupSchema);

if (Meteor.isClient) {
  Meteor.subscribe("group");
}


Group.allow({
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