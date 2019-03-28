export const GroupQuiz = new Mongo.Collection("groupQuiz");

GroupQuizSchema = new SimpleSchema({
    "component":{
        type: String,
        label: "quiz type"
    },
    "backgroundUrl":{
      type: String,
      label: "background image url",
      optional: true
    },
    "question":{
      type: String,
      label: "question",
      optional: true
    },
    "answerCount":{
      type: Number,
      label: "amount of answer field",
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
    "starItems":{
      type: [String],
      label: "quiz star questions",
      optional: true
    },
    "starCount":{
      type: Number,
      label: "amount of maximum star rating",
      optional: true
    },
    "rankItemsLoadExternalField":{
      type: String,
      label: "get rankItems from outside this collection",
      optional: true
    },
    "answerOptionsLoadExternalField":{
      type: String,
      label: "get answerOptions from outside this collection",
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