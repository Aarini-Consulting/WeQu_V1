Group = new Mongo.Collection("group");

GroupSchema = new SimpleSchema({
    "groupName":{
      type: String,
      label: "groupName"
    },
    "emails":{
      type: [String],
      label: "emails",
    },

    "emailsSurveyed":{
      type: [String],
      label: "emails",
      optional: true
    },

    "arr_emails_existing":{
      type: [String],
      label: "emails",
      optional: true
    },

    "arr_emails_notExisting":{
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
        if ( this.isUpdate || this.isUpsert ) {
          return new Date;
        }
      }
    },


})

Group.attachSchema(GroupSchema);

// TODO : For only Testing Purpose , Remove later

// Group.allow({
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