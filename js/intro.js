var bgScene, bgCam, scene, renderer, camera, container, logo, speedX, speedY, speedZ, spotLight, pointLight, mouseX, mouseY, mouseMoveX, mouseMoveY;

function leaveIntro() {
	
	cancelAnimationFrame(renderProcess);
	if (scene) {
		
		Util.removeChilds(scene);
	}
	Util.changeContent("menu.php");
	startBall();
}

function startLogo() {

	window.setTimeout(function() {

		leaveIntro();
	}.bind(this), 5000);

	Util.addBackground();

	trackPosition = new THREE.Vector3(0, 0, 0);
	speedX = .1;
	speedY = .1;
	speedZ = .1;

	mouseX = 0;
	mouseY = 0;                                                      

	scene = new THREE.Scene();
	container = $("#logo");
	container.css({

		width: $(window).innerWidth(),
		height: $(window).innerHeight() 
	});
	var overlay = $("#introOverlay");
	overlay.css({
		
		left: ($(window).innerWidth()-overlay.innerWidth())/2,
		top: ($(window).innerHeight()-overlay.innerHeight())/2
	})

	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0,5,7);     
	scene.add(pointLight);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(container.width(), container.height());
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setClearColor( 0x000000, 0 );     

	camera = new THREE.PerspectiveCamera(45, container.width()/container.height(), 1, 1000); 
	camera.position.z = 10;
	camera.position.y = 0;

	// model

	var loader = new THREE.OBJMTLLoader();
	loader.addEventListener( 'load', function ( event ) {

		logo = event.content;
		logo.position = {
			x: 0,
			y: 0,
			z: 0
		};
		camera.lookAt(logo.position);       
		scene.add( logo );

	});
	loader.load( 'obj/hanjo-logo.obj', 'obj/hanjo-logo.mtl' );

   	container.get(0).appendChild(renderer.domElement);

	var render = function() {

		renderProcess = requestAnimationFrame(render);   
    					  
		renderer.autoClear = false;
		renderer.clear();
		renderer.render(bgScene, bgCam);
	
		if (logo) {
			
			// logo.rotation.x += speedZ;
			logo.rotation.y += speedX; 
		}
                                                                 		
		renderer.render(scene, camera);
	};

	render();
}