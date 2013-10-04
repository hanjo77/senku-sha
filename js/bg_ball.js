var bgScene, bgCam, scene, renderer, camera, container, ball, track, speedX, speedY, speedZ, spotLight, pointLight, mouseX, mouseY, mouseMoveX, mouseMoveY;

$(document).ready(function() {
	
	startBall();
	var hashPos = window.location.href.indexOf("#")+1;
	if (hashPos > 0) {
		                                
	    var hash = window.location.href.substring(hashPos);
 		console.log(hash);
		if (hash && hash != "login" && hash != "register") {
			
			Util.changeContent(hash + ".php");
		}
	}
});

function startBall() {

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
	speedX = .01;
	speedY = .01;
	speedZ = .01;
		
	mouseX = 0;
	mouseY = 0;                                                      

	scene = new THREE.Scene();
	container = $("#bgBall");
	
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

	camera = new THREE.PerspectiveCamera(45, container.width()/container.height(), 1, 1000); 
	camera.position.z = 1.5;
	camera.position.y = 1;
	camera.lookAt(ball.position);       
	
   	container.get(0).appendChild(renderer.domElement);
	
	var render = function() {
		
		requestAnimationFrame(render);   
		    					  
		renderer.autoClear = false;
		renderer.clear();
		renderer.render(bgScene, bgCam);
		
		if (mouseX && mouseY) {
			
			if (mouseX && mouseY) {

				speedX = (mouseX-($(document).width()/2))/10000;
				speedZ = (mouseY-($(document).height()/2))/10000;
			}
		}
		
		ball.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), speedZ);
		ball.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), speedX);  
                                                                         		
		renderer.render(scene, camera);
	};

	render();
}