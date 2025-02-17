export const FeedbackRank =  new Mongo.Collection('feedbackRank');

FeedbackRankSchema = new SimpleSchema({
	"from":{
		type: String,
		label: "from"
	},
	"to":{
		type: String,
		label: "to"
	},
	"groupId":{
		type: String,
		label: "groupId",
	},
	"rankItems":{
		type: Object,
		blackbox:true
	},
	"activeWeights":{
		type: Object,
		blackbox:true
	},
	"rank":{
		type: Object,
		optional: true,
		blackbox:true
	},
	"firstSwipe":{
		type: [Object],
		optional: true,
		blackbox:true
	},
	"isSelected":{
		type: Boolean,
		optional: true,
	},
	"createdAt": {
		type: Date,
		label: "Date group created",
		optional: true,
		autoValue: function() {
		  if ( this.isInsert || this.isUpsert ) {
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

FeedbackRank.attachSchema(FeedbackRankSchema);