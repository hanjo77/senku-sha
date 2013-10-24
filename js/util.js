function Util() {

}

Util.removeChilds = function(obj) {

	for (var child in obj.children) {
	
		Util.removeChilds(obj.children[child]);
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
	
	/* if (obj.parent) {
	
		obj.parent.remove(obj);
	} */
}

Util.menuButton = function(name, content) {

	return $('<a id="' + name + '" class="menuButton" onclick="Util.' + name + '()">' + content + '</a>');
}         

Util.blockButton = function(blockTypeIndex) {

	var color = CONFIG.BLOCK_TYPES[blockTypeIndex].color.toString(16);
	while (color.length < 6) {
		
		color = "0" + color;
	} 
	return $('<a id="' + blockTypeIndex + '" class="blockButton" style="background-color: #' + color + '">&nbsp;</a>');
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
 
Util.getBallPosition = function(nextPos) {
	     
	var pos = game.ball.touchPoint();
	var result = new THREE.Vector3( 
			-nextPos.x,
			-nextPos.y,
			-nextPos.z
		);
	return result;                                                    
}  

Util.getCollisions = function(block, nextPos) {
	    
	var types = [];                              
	var ballPos = Util.getBallPosition(nextPos);                                              
	var movesLeft = (game.track.speedX > 0);
	var movesRight = (game.track.speedX < 0);
	var movesForward = (game.track.speedZ > 0);
	var movesBack = (game.track.speedZ < 0);
	var withinWidth = (ballPos.x > block.left) && (ballPos.x < block.right);
	var withinHeight = (ballPos.z > block.front) && (ballPos.z < block.back);
	var frontIntersection = ((Math.abs(ballPos.z-block.back) <= game.ball.geometry.radius) && withinWidth);
	var backIntersection = ((Math.abs(ballPos.z-block.front) <= game.ball.geometry.radius) && withinWidth);
	var leftIntersection = ((Math.abs(ballPos.x-block.left) <= game.ball.geometry.radius) && withinHeight);
	var rightIntersection = ((Math.abs(ballPos.x-block.right) <= game.ball.geometry.radius) && withinHeight); 
	var frontLeftIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(game.ball.geometry.radius, 2));
	var frontRightIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(game.ball.geometry.radius, 2));
	var backLeftIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(game.ball.geometry.radius, 2));
	var backRightIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(game.ball.geometry.radius, 2));
	if (backRightIntersection) {
                   
		types.push("frontLeft");                                      
	}
	else if (backLeftIntersection) {

		types.push("frontRight");
	}
	else if (frontRightIntersection) {

		types.push("backLeft");
	}
	else if (frontLeftIntersection) {

		types.push("backRight");
	}
	
	if (leftIntersection) {

		types.push("right");
	}
	else if (rightIntersection) {

		types.push("left");
	}
	else if (frontIntersection) {
                      
		types.push("back");
	}
	else if (backIntersection) {
                                                      
		types.push("front");
	}      
	
	return types;
}

Util.changeContent = function(page) {
	
	if (page == "game.php") {
		
		$("#bgBall").html("");
		if (bgBall) {
		
			cancelAnimationFrame(bgBall.renderProcess);
		}
	}
	$('#content').html("");
	$.ajax({ url: page }).done(function( data ) {
                       
		var contentDiv = $('#content');
		contentDiv.html(data);
		contentDiv.center();
		if (page == "editor.php") {
			                   
			editor = new Editor();
		}
		
		if (page != "game.php") {
			
			Util.initHandlers();  
		}
		var hash = "#";
		var content = page.substring(0, page.indexOf("."));
		if (content != "menu") {
			
			hash = "#" + page.substring(0, page.indexOf("."));
		}
		location.href = location.href.substring(0, location.href.indexOf("#")) + hash;
		Validation.formIsValid($('form').get(0));
		Util.updateWindow();		
	});
}

Util.handleHash = function() {
	
	var hash = "intro";
	var hashPos = window.location.href.indexOf("#")+1;
	if (hashPos > 0) {

		var hash = window.location.href.substring(hashPos);	
		if (hash == "" || hash == "menu") {

			hash = "menu";
			bgBall = new BackgroundBall();
		}
	} 
	Util.changeContent(hash + ".php");
}  

Util.getSecondsUntil = function(endTime) {
	
	if (endTime) {
		
		var difference = endTime-new Date().getTime();
		if (difference >= 0) {
			
			return Math.ceil(difference/1000);
		}
	}
	return null;
}         

Util.updateInfoHTML = function() {
	
	var hasContent = false;
	var info = "<table><tr><th class=\"right\">duration</th><th class=\"left\">state</th></tr><tr>";
	
		var duration = Util.getSecondsUntil(game.invertorEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"inverted\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">inverted controls</td></tr>";
		}
	
		duration = Util.getSecondsUntil(game.speedupEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"speedup\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">speed up</td></tr>";
		}
	
		duration = Util.getSecondsUntil(game.slowdownEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"slowdown\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">slow down</td></tr>";
		}
	
		duration = Util.getSecondsUntil(game.warpEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"warp\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">warp</td></tr>";
		}
	
	info += "</table>";
	var obj = $("#info");
	if (hasContent) {
		
		obj.html(info);
		obj.css({
			display: "block"
		});
	}
	else {
		
		obj.css({
			display: "none"
		});
	}
}

Util.initHandlers = function() {
	 	   
	$("#content").center();

	document.body.onselectstart = function() { return false; }
	
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
	   
		if (Validation.formIsValid()) {
			
			var postData = null;
			var postUrl = "";
			var formId = e.target.parentNode.parentNode.id;
			switch (formId) {
				
				case "userForm":
					postUrl = "register.php";
					postData = {
						
						name: $("#nameInput").val(),
						password: $("#passwordInput").val(),
						email: $("#emailInput").val(),
						submit: $("#btnSubmit").val()
					};
					break;
					
				case "loginForm":
					postUrl = "login.php";
					postData = {
						
						name: $("#nameInput").val(),
						password: $("#passwordInput").val(),
						submit: $("#btnSubmit").val()
					};
					break;
			}
			$.ajax({

				url: postUrl,
				type: "POST",
				data: postData
			}).done(function(result) {

				$("#content").html(result);
			});
		}
		return false;
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
         
		Util.updateWindow();
	});

	$('#controls a').click(function(e) {
          
		var obj = $(e.target);
		$('#controls a').removeClass("active");
		if (!obj.hasClass("active")) {
		                        
			editor.activeButton = obj;
			obj.addClass("active");
		}                          
	});

	window.setTimeout(function() { Validation.formIsValid() }, 1000);
}

Util.initEditorHandlers = function() {
	
	$('#editorDisplayWrapper *').unbind();
	
	$('#editorDisplayWrapper td').mousedown(function(e) {
        
		editor.addBlock(e.target.id);
		editor.mouseDown = true;
		return false;
	});
	
	$('#editorDisplayWrapper td').mouseup(function(e) {
        
		editor.mouseDown = false;
		return false;
	});
	
	$('#editorDisplayWrapper td').mousemove(function(e) {
        
		if (editor.mouseDown) {
			
			editor.addBlock(e.target.id);
		}
		return false;
	});
	
	$('#buttonUp').click(function(e) {
		
		editor.scrollUp();
	});
	
	$('#buttonDown').click(function(e) {
		
		editor.scrollDown();
	});
	
	$('#buttonUp, #buttonDown').mouseenter(function(e) {
		                
		$(e.target).css({ opacity: 1 });
	});
	
	$('#buttonUp, #buttonDown').mouseleave(function(e) {
		                
		$(e.target).css({ opacity: 0 });
	});
}

Util.updateWindow = function() {
	
	var obj = null;
	if (game) {
	
		obj = game;
	}
	else if (bgBall) {
	
		obj = bgBall;
	}
	if (obj && obj.renderer) {

		obj.camera.aspect = obj.container.width()/obj.container.height();
		obj.camera.updateProjectionMatrix();
		obj.renderer.setSize(obj.container.width(), obj.container.height());
	}
	$("#content").center();
}

jQuery.fn.center = function () {
    this.css({
    	
		position: "absolute",
		height: "auto",
		top: Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px",
		left: Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px"
	});
    return this;
}