/**
 * The background ball - Used as some background gimmick
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 * @constructor
 */

function BackgroundBall() {

	this.renderProcess;
	this.renderer;
	this.container;
	this.camera;
	this.scene;
	this.ball;
	this.speedX;
	this.speedY;
	this.speedZ;
	this.spotLight;
	this.pointLight;
	this.mouseMoveX;
	this.mouseMoveY;
	
	this.start();
}

/**
 * Start the background ball
 */

BackgroundBall.prototype.start = function () {

    this.speedX = .01;
    this.speedY = .01;
    this.speedZ = .01;

    this.scene = new THREE.Scene();
    this.container = $("#bgBall");

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(0, 5, 7);
    this.scene.add(this.pointLight);

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(0, 5, 0);
    this.spotLight.shadowCameraNear = 0.01;
    this.spotLight.castShadow = true;
    this.spotLight.shadowDarkness = 0.5;
    this.scene.add(this.spotLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.width(), this.container.height());
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.setClearColor(CONFIG.BACKGROUND_COLOR, 0);

    this.scene.fog = new THREE.Fog(CONFIG.BACKGROUND_COLOR, CONFIG.TRACK.FOG_NEAR, CONFIG.TRACK.FOG_FAR);

    this.ball = new Ball();
    this.scene.add(this.ball);

    this.camera = new THREE.PerspectiveCamera(45, this.container.width() / this.container.height(), 1, 1000);
    this.camera.position.z = 1.5;
    this.camera.position.y = 1;
    this.camera.lookAt(this.ball.position);

    this.container.get(0).appendChild(this.renderer.domElement);

    this.render();
};

/**
 * The rendering method called on each frame
 */

BackgroundBall.prototype.render = function() {
		
	this.renderProcess = requestAnimationFrame(this.render.bind(this));   
									
	if (mouseX && mouseY) {
		
		this.speedX = (mouseX-($(document).width()/2))/10000;
		this.speedZ = (mouseY-($(document).height()/2))/10000;
	}
	
	this.ball.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), this.speedZ);
	this.ball.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), this.speedX);
																			
	this.renderer.render(this.scene, this.camera);
};