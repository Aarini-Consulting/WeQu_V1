export const Group = new Mongo.Collection("group");

GroupSchema = new SimpleSchema({
    "groupName":{
      type: String,
      label: "groupName"
    },
    "userIds":{
      type: [String],
      label: "user id",
    },
    "userIdsSurveyed":{
      type: [String],
      label: "user ids surveyed",
      optional: true
    },
    "isActive":{
      type: Boolean,
      label: "session active",
    },
    "isPlaceCardActive":{
      type: Boolean,
      label: "place card session active",
      optional: true
    },
    "isPlaceCardFinished":{
      type: Boolean,
      label: "place card session finished",
      optional: true
    },
    "isFinished":{
      type: Boolean,
      label: "session finished"
    },
    "userIdsSelfRankCompleted":{
      type: [String],
      label: "self rank Completed",
      optional: true
    },
    "groupLanguage":{
      type: String,
      label: "group language",
      optional: true
    },
    "typeformGraph":{
      type: [Object],
      label: "typeformGraph",
      blackbox:true,
      optional: true
    },
    "creatorId": {
        type: String,
        label: "creator",
        optional: true,
        autoValue: function() {
            if (this.isInsert) {
                return this.userId;
            } 
        }
    },
    "groupQuizIdList":{
      type: [String],
      label: "group quiz ids",
      optional: true
    },
    "currentGroupQuizId":{
      type: String,
      label: "group language",
      optional: true
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