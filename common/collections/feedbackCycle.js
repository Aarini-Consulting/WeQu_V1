
// For storing the invitee users 

FeedbackCycle = new Mongo.Collection("feedback_cycle");

FeedbackCycleSchema = new SimpleSchema({
  "groupId":{
    type: String,
    label: "groupId",
  },
  "creatorId": {
      type: String,
      label: "creator",
      autoValue: function() {
          if (this.isInsert) {
              return Meteor.userId();
        } 
    }
  },
  "from": {
    type: Date,
    label: "date group cycle start",
    },
  "to": {
    type: Date,
    label: "date group cycle ends",
    optional: true,
    },
  "createdAt": {
    type: Date,
    label: "Date group cycle created",
    optional: true,
    autoValue: function() {
      if ( this.isInsert ) {
        return new Date;
      }
    }
  }
})

FeedbackCycle.attachSchema(FeedbackCycleSchema);