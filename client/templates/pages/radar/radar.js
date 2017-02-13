Template.radar.onCreated(function(){

	  var self = this;
	  self.autorun(function() {
	    self.subscribe("feedback");
	  });

	  // For some reasons score is getting re-initialised 

	  //TODO : Check why this is happening ?

	  console.log(this.data.score);

	   if(this.data.score){
       	this.data.points = dataForRadar(this.data.score);
       }
})