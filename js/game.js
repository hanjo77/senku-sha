var trackPosition = new THREE.Vector3(0, 0, 0);
var lastY, lastZ, timeRate, startTime, canMove, warpTimer, warpEndTime, invertorTimer, invertorEndTime, slowdownTimer, slowdownEndTime, speedupTimer, speedupEndTime, controlDirection, trackSpeed, speedModifier, tempSpeedX, tempSpeedY, tempSpeedZ, timeDifference, lastFrameTime, renderProcess, nextX, nextY, bgScene, bgCam, scene, renderer, camera, container, ball, track, speedX, speedY, speedZ, spotLight, pointLight;

$(document).keydown(function (e) {
		
	if (renderer) {
	
		switch (e.which) {      

			case CONFIG.KEYCODE.LEFT:
				if (canMove.left) {
					
					speedX = CONFIG.ACCELERATION*controlDirection;
				}
				break;
												 
			case CONFIG.KEYCODE.RIGHT:
				if (canMove.right) {
					
					speedX = -1*CONFIG.ACCELERATION*controlDirection;  
				}
				break;
										  
			case CONFIG.KEYCODE.UP:                
				if (canMove.back) {
					
					speedZ = trackSpeed;
				}
				if (!startTime) {
					
					startTime = new Date();
				}
				break;

			case CONFIG.KEYCODE.SPACE:
				if (!ball.inAir) {

					ball.isJumping = true;
				}
				break;
		}
	}
});  

$(document).keyup(function (e) {
											
	if (renderer) {
	
		switch (e.keyCode) {      

			case CONFIG.KEYCODE.LEFT:			 
			case CONFIG.KEYCODE.RIGHT:
				speedX = 0;
				break;
		}
	}
});  

$(window).resize(function() {
						 
	if (renderer) {
	
		container.css({
			
			width: $(window).innerWidth(),
			height: $(window).innerHeight() 
		});
		camera.aspect = container.width()/container.height();
		bgCam.aspect = container.width()/container.height();
		camera.updateProjectionMatrix();
		renderer.setSize(container.width(), container.height());
	}
})

startGame();

function startGame() {

	Util.addBackground()
	
	speedModifier = 1;
	controlDirection = 1;
	warpEndTime = 0;
	trackSpeed = CONFIG.TRACK_SPEED;
	trackPosition = new THREE.Vector3(0, 0, 0);
	speedX = 0;
	speedY = 0;
	speedZ = 0; 
	tempSpeedX = 0;
	tempSpeedY = 0;
	tempSpeedZ = 0; 
	canMove = {
		
		back: true,
		front: true,
		left: true,
		right: true
	};

	timeDifference = 0;
	lastFrameTime = new Date();
	
	scene = new THREE.Scene();
	container = $("#content");
	container.css({
		
		width: $(window).innerWidth(),
		height: $(window).innerHeight() 
	});
	
	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0,5,7);     
	scene.add(pointLight);     

	spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(0,5,0);
	spotLight.shadowCameraNear = 0.01;		
	spotLight.castShadow = true;
	spotLight.shadowDarkness = 0.5;  
	scene.add(spotLight);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(container.width(), container.height());
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setClearColor( CONFIG.BACKGROUND_COLOR, 0 );     
	
	scene.fog = new THREE.Fog(CONFIG.BACKGROUND_COLOR, CONFIG.TRACK.FOG_NEAR, CONFIG.TRACK.FOG_FAR);

	track = new Track();
	nextX = track.position.x;
	scene.add(track); 
	
	ball = new Ball();
	scene.add(ball);          

	camera = new THREE.PerspectiveCamera(60, container.width()/container.height(), .01, 1000);
	camera.position.y = 2;
	camera.position.z = 5;
	camera.lookAt(ball.position);       

   	container.get(0).appendChild(renderer.domElement);
	
	var render = function(time) {

		renderProcess = requestAnimationFrame(render);     
							
		timeDifference = time-lastFrameTime;
		lastFrameTime = time;				  
		
		renderer.autoClear = false;
		renderer.clear();
		renderer.render(bgScene, bgCam);
		
		track.position = track.nextPosition();
		track.updateBlocks();
		ball.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), -1*tempSpeedZ);
		ball.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), tempSpeedX);  
                             
		renderer.render(scene, camera);
		
	};

	render();
}

function clearGame() {

	ball = null;
	$(document).unbind();
	$(window).unbind();
	Util.removeChilds(scene);
	cancelAnimationFrame(renderProcess);
	Util.changeContent("menu.php");
	startBall();
	$("#info").css({
		display: "none"
	});	
}