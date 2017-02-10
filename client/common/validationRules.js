
	//Validation Rules
	trimInput = function(val){
		return val.replace(/^\s*$/g, "");
	}

	isNonEmpty = function(val){
		if(val && val !== ''){
			return true;
		}

		sAlert.error("Please fill in all fields");
		return false;
	};

	isEmail = function(val){
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(filter.test(val)){
			return true;
		}

		sAlert.error("Please use a valid email address");
		return false;
	};

	isValidPassword = function(password){
		if(password.length < 6){
			sAlert.error("Password must be at least 6 characters");
			return false;
		}
		return true;
	};

	isValidConfirmPassword = function(password, confirm){
		if(!isValidPassword(password)){
			return false;
		}

		if(password !== confirm){
			sAlert.error("Passwords do not match");
			return false;
		}

		return true;

	};


	checkLoggedIn = function(ctx, redirect) {  
	  if (!Meteor.userId()) {
	    redirect('/')
	  }
	}