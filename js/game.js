/**
 * The actual game class
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 * @constructor
 */

function Game(levelId) {

	this.renderProcess;
	this.renderer;
	this.container;
	this.camera;
	this.scene;
	this.timeRate;
	this.startTime;
	this.warpEndTime;
	this.invertorTimer;
	this.invertorEndTime;
	this.slowdownTimer;
	this.warpTimer; 
	this.slowdownEndTime;
	this.speedupTimer;
	this.speedupEndTime;
	this.controlDirection;
	this.timeDifference;
	this.lastFrameTime;
	this.renderProcess;
	this.spotLight;
	this.pointLight;
	this.ball;
	this.track;
	this.bgBall;
	this.levelTime;
	this.levelName;
	this.mousePos;
	this.isMouseControlled;
	this.fingers;
	this.hands;
	this.isFinished;
	this.trackPosition = new THREE.Vector3(0, 0, 0);
	this.isMotionEnabled;
	this.motionCenter;
	if (levelId) {
		
		this.currentLevel = levelId;
		this.isTest = true;
	}
	else {
		
		this.currentLevel = 1;
		this.nextLevel = 1;
	}
	this.isInGoal = true;
	this.lives = CONFIG.LIVES;
	
	this.startGame();
	
	Leap.loop(function(frame) {
	
		if (game) {
			
			game.hands = frame.hands;
			game.fingers = frame.pointables;
			if (game.fingers.length > 0) {
				
				if (!game.track.isStarted && game.fingers[0].tipVelocity[2] > 400) {
						
					game.track.start();
				}
				else if (game.track.isStarted && !game.isInGoal && game.fingers[0].tipVelocity[1] > 400) {
						
					game.ball.jump();
				}
			}
		}
	});
}

/**
 * Adds all event handlers for the game
 */

Game.prototype.addHandlers = function() {

	$(document).keydown(function (e) {
			
		if (game && game.ball && game.track) {
		
			switch (e.which) {      

				case CONFIG.KEYCODE.LEFT:
					if (game.ball.canMove.left) {
						
						game.track.speedX = CONFIG.ACCELERATION*game.controlDirection;
					}
					break;
													 
				case CONFIG.KEYCODE.RIGHT:
					if (game.ball.canMove.right) {
						
						game.track.speedX = -1*CONFIG.ACCELERATION*game.controlDirection;  
					}
					break;
											  
				case CONFIG.KEYCODE.UP:                
					if (!game.isFinished) {
						
						game.track.start();
					}
					break;

				case CONFIG.KEYCODE.SPACE:
					game.ball.jump();
					break;
			}
		}
	});  

	$(document).keyup(function (e) {
											
		if (game && game.ball && game.track) {
		
			switch (e.keyCode) {      

				case CONFIG.KEYCODE.LEFT:			 
				case CONFIG.KEYCODE.RIGHT:
					game.track.speedX = 0;
					break;
			}
		}
	});  

	$(window).resize(function() {
							 
		if (game && game.renderer) {
		
			game.container.css({
				
				width: $(window).innerWidth(),
				height: $(window).innerHeight(),
				background: "url(img/game_background.jpg)"
			});
			game.camera.aspect = game.container.width()/game.container.height();
			game.camera.updateProjectionMatrix();
			game.renderer.setSize(game.container.width(), game.container.height());
		}
	});
		
	$(window).mousemove(function(e) {
		
		game.mousePos = [e.clientX, e.clientY];
	});
	
	$(window).click(function(e) {
		
		game.isMouseControlled = true;
		if (game.track.isStarted) {
			
			game.ball.jump();
		}
		else {
			
			game.track.start();
		}
	});
	
	if (window.DeviceMotionEvent) {
		
		window.ondevicemotion = function(event) {
			
			if (!game.motionCenter) {
			
				game.motionCenter = [
					event.accelerationIncludingGravity.x,
					event.accelerationIncludingGravity.z
				];
			}
			var motion = [
				event.accelerationIncludingGravity.x - game.motionCenter[0],
				event.accelerationIncludingGravity.z - game.motionCenter[1]
			];
			
			if (motion[1] < -1) {
				
				if (game.track.isStarted) {
			
					// game.ball.jump();
				}
				else {
			
					game.track.start();
				}
			}
			if (game.track.isStarted) {
				
				game.track.speedX = motion[0]/-5;
			}
		}
	}
};

/**
 * Starts the game
 */

Game.prototype.startGame = function() {
	
	this.isFinished = false;
	this.controlDirection = 1;
	this.warpEndTime = 0;
	this.trackPosition = new THREE.Vector3(0, 0, 0);

	this.timeDifference = 0;
	this.lastFrameTime = new Date();
	
	this.scene = new THREE.Scene();
	this.container = $("#content");
	this.container.html("<div id=\"levelName\" />");
	this.container.css({
		
		width: $(window).innerWidth(),
		height: $(window).innerHeight(),
		background: "url(img/game_background.jpg)"
	});
	
	this.pointLight = new THREE.PointLight(0xffffff);
	this.pointLight.position.set(0,5,7);     
	this.scene.add(this.pointLight);     

	this.spotLight = new THREE.SpotLight(0xffffff);
	this.spotLight.position.set(0,5,0);
	this.spotLight.shadowCameraNear = 0.01;		
	this.spotLight.castShadow = true;
	this.spotLight.shadowDarkness = 0.5;  
	this.scene.add(this.spotLight);

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(this.container.width(), this.container.height());
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapSoft = true;
	this.renderer.setClearColor( CONFIG.BACKGROUND_COLOR, 0 );     
	
	this.scene.fog = new THREE.Fog(CONFIG.BACKGROUND_COLOR, CONFIG.TRACK.FOG_NEAR, CONFIG.TRACK.FOG_FAR);

	this.track = new Track(this.currentLevel, this.isTest);
	this.track.nextX = this.track.position.x;
	this.scene.add(this.track); 
	
	this.ball = new Ball();
	this.scene.add(this.ball);          

	this.camera = new THREE.PerspectiveCamera(60, this.container.width()/this.container.height(), .01, 1000);
	this.camera.position.y = 2;
	this.camera.position.z = 5;
	this.camera.lookAt(this.ball.position);       

   	this.container.get(0).appendChild(this.renderer.domElement);
	
	this.render();

	this.addHandlers();
};

/**
 * The rendering method called on each frame
 * @param {Number} time Current timestamp, used to synchronize game speed
 */

Game.prototype.render = function(time) {

	this.renderProcess = requestAnimationFrame(this.render.bind(this));     
													
	this.timeDifference = time-this.lastFrameTime;
	this.lastFrameTime = time;				  
	this.timeRate = this.timeDifference / 200;
	
	if (this.track && this.ball && !this.track.isStopped) {
	
		if (this.isInGoal && !this.track.isStarted) {
			
			this.track.position = this.track.nextGoalPosition();
		}
		else {
			
			if (!this.isInGoal) {
				
				this.levelTime = new Date();
				this.levelTime -= this.startTime;
				this.levelTime = Math.floor(this.levelTime/1000);
				Util.updateInfoHTML();
			}
			this.track.position = this.track.nextPosition();
		}
		this.track.updateBlocks();
		this.ball.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), -1*this.track.tempSpeedZ);
		this.ball.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), this.track.tempSpeedX);  
	}
						 
	this.renderer.render(this.scene, this.camera);
};

/**
 * Clears the game and returns to menu or editor, without parameters, the menu will be opened.
 * @param {Number} editLevelId ID of the level, if set, editor will be opened
 * @param {Boolean} edit If true, the level will be loaded in editor, otherwise, level selection will be opened 
 */

Game.prototype.clearGame = function(editLevelId, edit) {

	cancelAnimationFrame(this.renderProcess);
	$(window).unbind();
	$("*").unbind();
	this.container.css({
		
		background: "none"
	})
	bgBall = new BackgroundBall();
	$("#info").css({
		display: "none"
	});	
	if (editLevelId) {
		
		var param = "";
		if (edit) {
			
			param = "?id=" + this.currentLevel;
		}
		Util.changeContent("editor.php" + param);
	}
	else {
		
		Util.changeContent("menu.php");
	}
	this.currentLevel = 1;
	delete this;
};

/**
 * Saves the current time to the database
 */
Game.prototype.saveTime = function() {
	
	$.ajax({
		
		url: "save_time.php",
		type: "POST",
		data: {
			
			time: game.levelTime,
			level: game.currentLevel
		}
	});
}