GroupQuiz = new Mongo.Collection("groupQuiz");

GroupQuizSchema = new SimpleSchema({
    "component":{
        type: String,
        label: "quiz type"
    },
    "question":{
      type: String,
      label: "question",
      optional: true
    },
    "answerOptions":{
      type: [String],
      label: "quiz answer options",
      optional: true
    },
    "rankItems":{
      type: [String],
      label: "quiz rank items",
      optional: true
    },
    "rankItemsLoadExternalField":{
      type: String,
      label: "get rankItems from outside this collection",
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

GroupQuiz.attachSchema(GroupQuizSchema);