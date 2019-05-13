export const PlayCard =  new Mongo.Collection('playCard');

PlayCardSchema = new SimpleSchema({
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
	"playCardType":{
		type: String,
		label: "card chosen type",
	},
	"cardsToChoose":{
		type: [Object],
		blackbox:true,
		label: "cards to choose",
	},
	"cardChosen":{
		type: [Object],
		blackbox:true,
		label: "card chosen",
		optional: true,
	},
	"cardGrade":{
		type:Number,
		label:"card grade",
		optional:true
	},
	"discussionFinished":{
		type: Boolean,
		label: "card discussion finished",
		optional:true
	},
	"createdAt": {
		type: Date,
		label: "Date created",
		optional: true,
		autoValue: function() {
		  if ( this.isInsert || this.isUpsert ) {
			return new Date;
		  }
		}
	  },
	  "updatedAt": {
		type: Date,
		label: "Date updated",
		optional: true , 
		autoValue: function() {
		  if ( this.isUpdate || this.isUpsert ) {
			return new Date;
		  }
		}
	  },

})

PlayCard.attachSchema(PlayCardSchema);