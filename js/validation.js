/**
 * Static methods used for form validation
 * @author Hanjo
 * @version $Rev$
 * @requires OtherClassName
 * @constructor
 */

function Validation() {
	
	
}

/**
 * Validates all input fields
 * @returns true if all input fields are valid, otherwise false
 * @type Boolean
 */

Validation.formIsValid = function() {
	   
	var valid = true;
	$.each( $('input'), function( key, value ) {    
		             
		if (!Validation.validateField($(value))) {
			
			valid = false;
		};
	});
	return valid;
}

/**
 * Validates a form field
 * @param {Object} obj A jQuery object of the form field to validate
 * @returns true if all input fields are valid, otherwise false
 * @type Boolean
 */

Validation.validateField = function(obj) {
	   
	var valid = true;
  	if (obj.attr("class")) {
		
		var types = obj.attr("class").split(" ");
		var messageBox = $('#validate_' + obj.attr("id"));
		messageBox.html("");
		for (var i = 0; i < types.length; i++) {

			switch(types[i]) {

				case "required":   

					if (!obj.val()) {

						messageBox.html("required"); 
						valid = false;
					}                            
					break; 

				case "email":   

				   	if (!obj.val()) {

						messageBox.html("not valid"); 
						valid = false
					}                            
					break;  

				case "password":       

					if (obj.val().length < 6) {

						messageBox.html("too short");
						valid = false;
					}                            
					break; 

				case "passwordRepeat": 

					if (obj.val() != $('#' + obj.attr('data-rel')).val()) {

						messageBox.html("does not match");
						valid = false;
					}                            
	    			break;
			}
		}
	}
	return valid;	
}