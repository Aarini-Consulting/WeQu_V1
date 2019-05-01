export const CardChosen =  new Mongo.Collection('cardChosen');

CardChosenSchema = new SimpleSchema({
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
	"cardsToChoose":{
		type: [Object],
		blackbox:true,
		label: "cards to choose",
	},
	"cardChosen":{
		type: Object,
		blackbox:true,
		label: "card chosen",
		optional: true,
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

CardChosen.attachSchema(CardChosenSchema);