GroupQuizResult = new Mongo.Collection("groupQuizResult");

GroupQuizResultSchema = new SimpleSchema({
    "groupId":{
      type: String,
      label: "group id"
    },
    "groupQuizId":{
        type: String,
        label: "group quiz id"
    },
    "results":{
        type: [Object],
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

GroupQuizResult.attachSchema(GroupQuizResultSchema);