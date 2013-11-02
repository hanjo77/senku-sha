function Game() {

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
	this.trackPosition = new THREE.Vector3(0, 0, 0);
	this.currentLevel = 1;
	this.nextLevel = 1;
	this.isInGoal = true;
	this.lives = CONFIG.LIVES;
	
	this.addHandlers();
	this.startGame();
}

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
					game.track.start();
					break;

				case CONFIG.KEYCODE.SPACE:
					if (!game.ball.inAir) {

						game.ball.isJumping = true;
					}
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
}

Game.prototype.startGame = function() {
	
	this.controlDirection = 1;
	this.currentLevel = 1;
	this.nextLevel = 1;
	this.warpEndTime = 0;
	this.trackPosition = new THREE.Vector3(0, 0, 0);

	this.timeDifference = 0;
	this.lastFrameTime = new Date();
	
	this.scene = new THREE.Scene();
	this.container = $("#content");
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

	this.track = new Track();
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
}

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
}

Game.prototype.clearGame = function() {

	cancelAnimationFrame(this.renderProcess);
	$(window).unbind();
	$("*").unbind();
	this.container.css({
		
		background: "none"
	})
	this.currentLevel = 1;
	Util.changeContent("menu.php");
	bgBall = new BackgroundBall();
	$("#info").css({
		display: "none"
	});	
	delete this;
}