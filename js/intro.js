
function Intro() {

	this.renderProcess;
	this.renderer;
	this.container;
	this.camera;
	this.scene;
	this.logo;
	this.speedX;
	this.speedY;
	this.speedZ;
	this.spotLight;
	this.pointLight;
	this.mouseMoveX;
	this.mouseMoveY;
	
	this.start();
}

Intro.prototype.leave = function() {
	
	cancelAnimationFrame(this.renderProcess);
	if (this.scene) {
		
		Util.removeChilds(this.scene);
	}
	Util.changeContent("menu.php");
	bgBall = new BackgroundBall();
}

Intro.prototype.start = function() {

	window.setTimeout(function() {

		intro.leave();
	}.bind(this), 5000);

	this.speedX = .1;
	this.speedY = .1;
	this.speedZ = .1;                                                    

	this.scene = new THREE.Scene();
	this.container = $("#logo");
	this.container.css({

		width: $(window).innerWidth(),
		height: $(window).innerHeight() 
	});
	var overlay = $("#introOverlay");
	overlay.css({
		
		left: ($(window).innerWidth()-overlay.innerWidth())/2,
		top: ($(window).innerHeight()-overlay.innerHeight())/2
	})

	this.pointLight = new THREE.PointLight(0xffffff);
	this.pointLight.position.set(0,5,7);     
	this.scene.add(this.pointLight);

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(this.container.width(), this.container.height());
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapSoft = true;
	this.renderer.setClearColor( 0x000000, 0 );     

	this.camera = new THREE.PerspectiveCamera(45, this.container.width()/this.container.height(), 1, 1000); 
	this.camera.position.z = 10;
	this.camera.position.y = 0;

	// model

	var loader = new THREE.OBJMTLLoader();
	loader.addEventListener( 'load', function ( event ) {

		intro.logo = event.content;
		intro.logo.position = {
			x: 0,
			y: 0,
			z: 0
		};
		intro.camera.lookAt(intro.logo.position);       
		intro.scene.add( intro.logo );

	});
	loader.load( 'obj/hanjo-logo.obj', 'obj/hanjo-logo.mtl' );

   	this.container.get(0).appendChild(this.renderer.domElement);

	this.render();
}

Intro.prototype.render = function() {

	this.renderProcess = requestAnimationFrame(this.render.bind(this));   
					  
	if (this.logo) {
		
		this.logo.rotation.y += this.speedX; 
	}
																	
	this.renderer.render(this.scene, this.camera);
}