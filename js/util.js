function Util() {

}

Util.removeChilds = function(obj) {

	for (var child in obj.children) {
	
		Util.removeChilds(obj.children[child]);
	}
	
	if (obj.parent) {
	
		obj.parent.remove(obj);
	}
	
	if (obj.geometry) {
		
		obj.geometry.dispose();
	}                        
	
	if (obj.material) {
		
		obj.material.dispose();
	}                        
	
	if (obj.texture) {
		
		obj.texture.dispose();
	}                        
	
	if (obj.dispose) {
	
		obj.dispose();
	}
}

Util.menuButton = function(name, content) {

	return $('<a id="' + name + '" class="menuButton" onclick="Util.' + name + '()">' + content + '</a>');
}         

Util.blockButton = function(blockTypeIndex) {

	return $('<a id="' + blockTypeIndex + '" class="blockButton" style="background-color: #' + CONFIG.BLOCK_TYPES[blockTypeIndex].color.toString(16) + '">&nbsp;</a>');
}         

Util.exit = function() {
	   
	Util.changeContent("menu.php");
	// window.location.href = "index.php";
}

Util.editorSave = function() {

	$.ajax({
		
		url: "save_level.php",
		type: "POST",
		data: {
			
			title: $("#levelTitle").val(),
			data: editor.levelString(),
			id: $("#levelId").val()
		}
	}).done(function(result) {
		
		if (parseInt(result, 10) > 0) {
			
			$("#levelId").val(result);
		}
	});
}

Util.editorClear = function() {

	$('#display').html('');
}
 
Util.getBallPosition = function(trackPosition) {
	     
	var pos = ball.touchPoint();
	var result = new THREE.Vector3( 
		pos.x - Math.round(trackPosition.x*1000)/1000,
		pos.y - Math.round(trackPosition.y*1000)/1000,
		pos.z - Math.round(trackPosition.z*1000)/1000
	);                   
	// console.log("getBallPosition: " + pos.x + " - " + result.x);
	return result;                                                    
}  

Util.getCollisions = function(block, nextPos) {
	    
	var types = [];                              
	var ballPos = Util.getBallPosition(nextPos);                                              
	var movesLeft = (speedX > 0);
	var movesRight = (speedX < 0);
	var movesForward = (speedZ > 0);
	var movesBack = (speedZ < 0);
	var withinWidth = (ballPos.x > block.left) && (ballPos.x < block.right);
	var withinHeight = (ballPos.z > block.front) && (ballPos.z < block.back);
	var frontLeftIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var frontRightIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
	var backLeftIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var backRightIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
	var frontIntersection = ((Math.abs(ballPos.z-block.front) < ball.geometry.radius) && withinWidth);
	var backIntersection = ((Math.abs(ballPos.z-block.back) < ball.geometry.radius) && withinWidth);
	var leftIntersection = ((Math.abs(ballPos.x-block.left) < ball.geometry.radius) && withinHeight);
	var rightIntersection = ((Math.abs(ballPos.x-block.right) < ball.geometry.radius) && withinHeight); 
	if (backRightIntersection) {
                   
		types.push("frontLeft");                                      
		console.log ("hit frontLeft");
	}
	else if (backLeftIntersection) {

		types.push("frontRight");
		console.log ("hit frontRight");
	}
	else if (frontRightIntersection) {

		types.push("backLeft");
		console.log ("hit backLeft");
	}
	else if (frontLeftIntersection) {

		types.push("backRight");
		console.log ("hit backRight");
	}        
	
	if (leftIntersection) {

		types.push("right");
		console.log ("hit right");
	}
	else if (rightIntersection) {

		types.push("left");
		console.log ("hit left");
	}
	else if (frontIntersection) {
                      
		types.push("back");
		console.log ("hit back");
	}
	else if (backIntersection) {
                                                      
		types.push("front");
		console.log ("hit front");
	}      
	
	return types;
}

Util.changeContent = function(page) {
	
	$.ajax({ url: page }).done(function( data ) {
                       
		var contentDiv = $('#content');
		contentDiv.html(data);
		contentDiv.center();
		if (page == "editor.php") {
			                   
			editor = new Editor();
		}
		Util.initHandlers();  
		var hash = "#";
		var content = page.substring(0, page.indexOf("."));
		if (content != "menu") {
			
			hash = "#" + page.substring(0, page.indexOf("."));
		}
		location.href = location.href.substring(0, location.href.indexOf("#")) + hash;
		Validation.formIsValid($('form').get(0));
		
	});
}           

Util.initHandlers = function() {
	    
	$("#content").center();

	$('#btnCancel').click(function(e) {
	   
		Util.changeContent("menu.php");
	});

	$('#btnLogout').click(function(e) {
	   
		Util.changeContent("menu.php?logout=true");
	});
	
   	$('a').click(function(e) {
	         
		var url = $(e.target).attr("rel");
		if (url) {
			                       
			Util.changeContent(url);
			return false;                                           
		}
	});	

	$('input').keyup(function(e) {
	   
		Validation.validateField($(e.target));
	});

	$('#btnSubmit').click(function(e) {
	   
		return Validation.formIsValid();
	});

	$('#controls a').click(function(e) {
              
		var obj = $(e.target);
		$('#controls a').removeClass("active");
		if (!obj.hasClass("active")) {
		                        
			editor.activeButton = obj;
			obj.addClass("active");
		}                          
	});
	
	$('#editorDisplayWrapper *').click(function(e) {
        
		var pos = [
			Math.floor(e.offsetX / editor.blockButton.innerWidth()), 
			Math.floor(e.offsetY / editor.blockButton.innerHeight())
		];
		editor.addBlock(pos);
	});
	
	$('#buttonUp, #buttonDown').mouseenter(function(e) {
		                
		$(e.target).css({ opacity: 1 });
	});
	
	$('#buttonUp, #buttonDown').mouseleave(function(e) {
		                
		$(e.target).css({ opacity: 0 });
	});
	
	$(document).mousemove(function(e) {
		                
		if (mouseX && mouseY) {
			
			mouseMoveX = e.clientX-mouseX;
			mouseMoveY = mouseY-e.clientY;
		}
		mouseX = e.clientX;
		mouseY = e.clientY;
  	});
	
	$('#bgBall').mouseleave(function(e) {
		                
		mouseMoveX = 0;
		mouseMoveY = 0;
		mouseX = 0;
		mouseY = 0;
	});
	
	$(window).resize(function() {
         
		if (renderer) {

			camera.aspect = container.width()/container.height();
			camera.updateProjectionMatrix();
			renderer.setSize(container.width(), container.height());
		}
		$("#content").center();
		if (editor) {
			
			editor.updateOffset();
			editor.drawBlocks();
		}
	});

	window.setTimeout(function() { Validation.formIsValid() }, 1000);
}

jQuery.fn.center = function () {
    this.css("position","absolute"); 
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}