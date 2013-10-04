var trackPosition = new THREE.Vector3(0, 0, 0);
var bgScene, bgCam, scene, renderer, camera, container, ball, track, speedX, speedY, speedZ, spotLight, pointLight;

$(document).keydown(function (e) {
											
	if (renderer) {
	
		switch (e.keyCode) {      

			case CONFIG.KEYCODE.LEFT:
				speedX += CONFIG.ACCELERATION;
				break;
												 
			case CONFIG.KEYCODE.RIGHT:         
				speedX -= CONFIG.ACCELERATION;
				break;
										  
			case CONFIG.KEYCODE.UP:                
				speedZ += CONFIG.ACCELERATION;
				break;

			case CONFIG.KEYCODE.DOWN:              
				speedZ -= CONFIG.ACCELERATION;
				break;   

			case CONFIG.KEYCODE.SPACE:
				if (!ball.isJumping) {

					speedY = -1*CONFIG.JUMP_SPEED;
					ball.isJumping = true;
					ball.isFalling = false;
				}
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

$(document).ready(function() {
	
	startGame();
});

function startGame() {

	var bgTexture = THREE.ImageUtils.loadTexture('img/horizon.jpg');
	var bg = new THREE.Mesh(
	  new THREE.PlaneGeometry(2, 2, 0),
	  new THREE.MeshBasicMaterial({map: bgTexture})
	);
	// The bg plane shouldn't care about the z-buffer.
	bg.material.depthTest = false;
	bg.material.depthWrite = false;

	bgScene = new THREE.Scene();
	bgCam = new THREE.Camera();
	bgScene.add(bgCam);
	bgScene.add(bg);

	trackPosition = new THREE.Vector3(0, 0, 0);
	speedX = 0;
	speedY = 0;
	speedZ = 0; 

	scene = new THREE.Scene();
	container = $("#game");
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

	ball = new Ball();
	scene.add(ball);          

	track = new Track();
	scene.add(track); 
	
	camera = new THREE.PerspectiveCamera(60, container.width()/container.height(), .01, 1000);
	camera.position.y = 2;
	camera.position.z = 5;
	camera.lookAt(ball.position);       

   	container.get(0).appendChild(renderer.domElement);
	
	var render = function() {
		requestAnimationFrame(render);     
											  
		renderer.autoClear = false;
		renderer.clear();
		renderer.render(bgScene, bgCam);
		
		track.position = track.nextPosition();
		track.updateBlocks();
		ball.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), -1*speedZ);
		ball.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), speedX);  
                                 
		if (ball.isFalling){
				
			var posY = 0;
			if (ball.blockUnderBall(track.position)) {
				
				posY = -1*(ball.blockUnderBall(track.position).blockHeight/2);
			}     
			if (track.position.y < posY) {
				
				speedY = (speedY == 0 ? 0.005 : Math.abs(speedY)*1.1);
				ball.isJumping = true;
			}
			else if (ball.isJumping) {
					 
				track.position.y = posY;
				ball.isJumping = false;
				speedY = 0;
			}
		}
		if (ball.isJumping) {
			
			if (!ball.isFalling) {
					  
				if (speedY < -0.01) {
					
					speedY = speedY*.9;
				}
				else {
					
					ball.isFalling = true;
				}
			}
		}
                                        		
		renderer.render(scene, camera);
	};

	render();
}

function clearGame() {

	Util.removeChilds(scene);
	window.location.href = "index.php";
}