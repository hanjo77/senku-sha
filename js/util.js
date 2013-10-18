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
	     
	var pos = ball.touchPoint();
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
	var movesLeft = (speedX > 0);
	var movesRight = (speedX < 0);
	var movesForward = (speedZ > 0);
	var movesBack = (speedZ < 0);
	var withinWidth = (ballPos.x > block.left) && (ballPos.x < block.right);
	var withinHeight = (ballPos.z > block.front) && (ballPos.z < block.back);
	var frontIntersection = ((Math.abs(ballPos.z-block.back) <= ball.geometry.radius) && withinWidth);
	var backIntersection = ((Math.abs(ballPos.z-block.front) <= ball.geometry.radius) && withinWidth);
	var leftIntersection = ((Math.abs(ballPos.x-block.left) <= ball.geometry.radius) && withinHeight);
	var rightIntersection = ((Math.abs(ballPos.x-block.right) <= ball.geometry.radius) && withinHeight); 
	var frontLeftIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var frontRightIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
	var backLeftIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var backRightIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
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

Util.addBackground = function() {
	
	var bgTexture = THREE.ImageUtils.loadTexture('img/horizon.jpg');
	var bg = new THREE.Mesh(
	  new THREE.PlaneGeometry(2, 2, 0),
	  new THREE.MeshBasicMaterial({map: bgTexture})
	);
	bg.material.depthTest = false;
	bg.material.depthWrite = false;

	bgScene = new THREE.Scene();
	bgCam = new THREE.Camera();
	bgScene.add(bgCam);
	bgScene.add(bg);
}

Util.changeContent = function(page) {
	
	if (page == "game.php") {
		
		$("#bgBall").html("");
		cancelAnimationFrame(renderProcess);
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
			startBall();
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
	
		var duration = Util.getSecondsUntil(invertorEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"inverted\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">inverted controls</td></tr>";
		}
	
		duration = Util.getSecondsUntil(speedupEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"speedup\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">speed up</td></tr>";
		}
	
		duration = Util.getSecondsUntil(slowdownEndTime);
		if (duration) {
		
			hasContent = true;
			info += "<tr class=\"slowdown\"><td class=\"right\">";
			info += duration;
			info += "</td><td class=\"left\">slow down</td></tr>";
		}
	
		duration = Util.getSecondsUntil(warpEndTime);
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
         
		Util.updateWindow();
	});

	window.setTimeout(function() { Validation.formIsValid() }, 1000);
}

Util.updateWindow = function() {
	
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