Feedback =  new Mongo.Collection('feedback');

FeedbackSchema = new SimpleSchema({
    "from":{
    	type: String,
    	label: "from"
    },
    "to":{
    	type: String,
    	label: "to"
	},
	"groupName":{
    	type: String,
		label: "groupName",
		optional:true
	},
	"groupId":{
    	type: String,
		label: "groupId",
		optional:true
    },
    "qset":{
    	type: [Object],
    	label: "qset"
    },
    "done":{
    	type: Boolean,
    	label: "done"
    },
    "invite":{
    	type: Boolean,
    	label: "invite",
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

Feedback.attachSchema(FeedbackSchema);