<!DOCTYPE HTML>
<html>
<head> 
	<meta charset="UTF-8">
	<title>先駆者</title>
	<link link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet' type='text/css' />
	<link rel="stylesheet" type="text/javascript" href="css/style.css" />
	<style>
	
	#introOverlay {
		
		position: absolute;
		text-align: center;
		font-size: 2em;
		text-shadow: 0 0 20px #fff;
		color: #000;
	}
	
	</style>
	<script src="js/lib/jquery.min.js"></script>
	<script src="js/lib/three.min.js"></script>
	<script src="js/lib/obj_mtl_loader.js"></script>
	<script src="js/lib/mtl_loader.js"></script>
</head> 
<body style="background-color: #000;"> 
<div id="logo"></div>
<div id="introOverlay">Hanjo presents</div>
	<script>
	
	var bgScene, bgCam, scene, renderer, camera, container, logo, speedX, speedY, speedZ, spotLight, pointLight, mouseX, mouseY, mouseMoveX, mouseMoveY;

	$(document).ready(function() {

		startLogo();
		window.setTimeout(function() {
			
			window.location.href = "start.php";
		}, 5000);
	});

	function startLogo() {

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
			console.log(logo);
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
	
			requestAnimationFrame(render);   
	    					  
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

	</script>

</body> 
</html>
