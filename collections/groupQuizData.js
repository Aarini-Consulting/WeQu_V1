export const GroupQuizData = new Mongo.Collection("groupQuizData");

GroupQuizDataSchema = new SimpleSchema({
    "groupId":{
      type: String,
      label: "group id"
    },
    "groupQuizId":{
        type: String,
        label: "group quiz id"
    },
    "creatorId":{
      type: String,
      label: "creator id"
    },
    "results":{
        type: Object,
        label: "group quiz result",
        blackbox:true,
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

GroupQuizData.attachSchema(GroupQuizDataSchema);