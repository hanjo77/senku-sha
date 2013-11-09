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

Util.blockButton = function(blockType) {

	var color = Util.getHexColorFromInt(blockType.color);
	return $('<a id="' + blockType.id + '" class="blockButton" style="background-color: ' + color + '">&nbsp;</a>');
}     

Util.getHexColorFromInt = function(intColor) {
	
	var color = intColor.toString(16);
	while (color.length < 6) {
	
		color = "0" + color;
	}
	return "#" + color;
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

Util.editorLevelSelection = function() {

	$.ajax({
		
		url: "level_selection.php"
	}).done(function(result) {

		$("#display").html(result);
		editor.initHandlers();
	});
	$("#buttonUp, #buttonDown").css({
		
		display: "none"
	});
}

Util.deleteLevel = function(levelId) {

	$("#levelId").val(levelId);
	$.ajax({
		
		url: "delete_level.php",
		type: "POST",
		data: {
			
			id: levelId
		}
	}).done(function(result) {
			
		Util.editorLevelSelection();
	});
}

Util.loadLevel = function(levelId) {

	$("#levelId").val(levelId);
	$.ajax({
	
		url: "load_editor_level.php",
		type: "POST",
		data: {
		
			id: levelId
		}
	}).done(function(result) {
		
		editor.loadLevel(eval("(" + result + ")"));
	});
}

Util.editorClear = function() {

	editor.clear();
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
	// console.log(ballPos);                                             
	var movesLeft = (game.track.speedX > 0);
	var movesRight = (game.track.speedX < 0);
	var movesForward = (game.track.speedZ > 0);
	var movesBack = (game.track.speedZ < 0);
	var withinWidth = (ballPos.x > block.left) && (ballPos.x < block.right);
	var withinLength = (ballPos.z > block.front - (CONFIG.BLOCK_SIZE/2)) && (ballPos.z < block.back - (CONFIG.BLOCK_SIZE/2));
	console.log(withinLength);
	var neighbours = block.neighbours;
	// console.log(block.left + " " + block.right);
	var frontIntersection = ((ballPos.z <= block.front + (CONFIG.BLOCK_SIZE/2) + game.ball.geometry.radius)
		&& (ballPos.z > block.front)
		&& withinWidth);
	var backIntersection = ((ballPos.z >= (block.back + (CONFIG.BLOCK_SIZE/2)) - game.ball.geometry.radius)
		&& (ballPos.z < block.back)
		&& withinWidth);
	var leftIntersection = ((ballPos.x >= block.right - game.ball.geometry.radius) 
		&& (ballPos.x < block.left + (CONFIG.BLOCK_SIZE/2))
		&& withinLength);
	var rightIntersection = ((ballPos.x <= block.left + game.ball.geometry.radius ) 
		&& (ballPos.x > block.right - (CONFIG.BLOCK_SIZE/2))
		&& withinLength); 
	if (leftIntersection) {

		/* if (backIntersection) {
			
			types.push("frontRight");
		}
		else if (frontIntersection) {
			
			types.push("backRight");
		} */
		types.push("left");
	}
	else if (rightIntersection) {

		/* if (backIntersection) {
			
			types.push("frontLeft");
		}
		else if (frontIntersection) {
			
			types.push("backLeft");
		} */
		types.push("right");
	}
	if (frontIntersection) {
                      
		types.push("front");
	}
	else if (backIntersection) {
                                                      
		types.push("back");
	}      
	if (types.length > 0) console.log(types);
	return types;
}

Util.activateLevel = function(levelId) {
	
	game.clearGame(levelId);
	$.ajax({
		
		url: "activate_level.php",
		type: "POST",
		data: {
			
			id: levelId
		}
	}).done(function(result) {
			
		Util.editorLevelSelection();
	});
}

Util.testLevel = function(levelId) {
	
	Util.changeContent("game.php?id=" + levelId);
}

Util.editLevel = function(levelId) {
	
	if (game) {
		
		game.clearGame(levelId, true);
	}
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
                       
		var id = 0;
		var contentDiv = $('#content');
		contentDiv.html(data);
		contentDiv.center();
		if (page.indexOf("id=") > -1) {
		
			id = page.substring(page.indexOf("id=") + 3);
		}
		if (page.indexOf("editor.php") > -1) {
			               
			editor = new Editor(id);
		}
		
		if (page != "game.php") {
			
			Util.initHandlers();  
		}
				
		var hash = "#";
		var content = page.substring(0, page.indexOf("."));
		if (content != "menu") {
			
			hash = "#" + page.substring(0, page.indexOf("."));
		}
		if (id > 0) {
		
			hash += "_" + id;
		}
		location.href = location.href.substring(0, location.href.indexOf("#")) + hash;
		Validation.formIsValid($('form').get(0));
		Util.updateWindow();		
	});
}

Util.handleHash = function() {
	
	var hash = "intro";
	var param = "";
	var hashPos = window.location.href.indexOf("#")+1;
	if (hashPos > 0) {

		var hash = window.location.href.substring(hashPos);
		if (hash.indexOf("_") > -1) {
		
			var id = hash.substring(hash.indexOf("_") + 1);
			param = "?id=" + id;
			hash = hash.substring(0, hash.indexOf("_"));
		}
		else if (hash == "" || hash == "menu") {

			hash = "menu";
			bgBall = new BackgroundBall();
		}
	} 
	Util.changeContent(hash + ".php" + param);
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
	var info = "";
	var timeContent = "";
	var lifeContent = "";
	var realTest = true;
	if (game.isInGoal) {
		
		hasContent = true;
		if (game.nextLevel) {
			
			info += "<h2>Level completed!</h2>";
		}
		else {
			
			info += "<h2>Game completed!</h2>";
			if (game.isTest) {
			
				info += "<a onclick=\"Util.activateLevel(" + game.currentLevel + ")\" class=\"menuButton\">Activate</a>";
				info += "<a onclick=\"Util.editLevel(" + game.currentLevel + ")\" class=\"menuButton\">Edit</a>";
			}
			else {
												
				window.setTimeout(function() {
				
					game.clearGame();
				}, 5000);
				game.isTest = true;
				realTest = false;
			}
			game.isFinished = true;
		}
	}
	else {
				
		info = "<table><tr><th class=\"right\">duration</th><th class=\"left\">state</th></tr><tr>";
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
		
		if (!hasContent) {
			
			info = "";
		}
		hasContent = true;
		if (game.track.isStopped && game.lives <= 0) {
			
			info = "<h2>Game Over</h2>";
			if (game.isTest) {
				
				info += "<a onclick=\"Util.editLevel(" + game.currentLevel + ")\" class=\"menuButton\">Edit</a>";
			}
			else {
				
				window.setTimeout(function() {
				
					game.clearGame();
				}, 5000);
			}
		}
		else {
			
			timeContent = "Time:&nbsp;" + game.levelTime;
			lifeContent = "Lives:&nbsp;" + game.lives;
		}
	}
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
	$("#timeDisplay").html(timeContent);
	$("#lifeDisplay").html(lifeContent);
	$("#lifeDisplay").css({
			display: "block"
		});
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

	$('#controls a.blockButton').click(function(e) {
          
		var obj = $(e.target);
		$('#controls a.blockButton').removeClass("active");
		if (!obj.hasClass("active")) {
		                        
			editor.activeButton = obj;
			obj.addClass("active");
		}                          
	});

	window.setTimeout(function() { Validation.formIsValid() }, 1000);
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