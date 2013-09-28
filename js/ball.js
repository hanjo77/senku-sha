/**
  *  Ball - the main actor
  **/
function Ball() {
	       
	// call parent constructor
	THREE.Mesh.call(this);
	this.geometry = new THREE.SphereGeometry(CONFIG.BALL_RADIUS, 24, 16);  
	this.position.y = CONFIG.BALL_RADIUS;
	
	this.texture = THREE.ImageUtils.loadTexture('img/ball_texture.png');
	this.material = new THREE.MeshLambertMaterial({
		map: this.texture,                 
	}),                                                                     
	                             
	this.castShadow = true;
	this.receiveShadow = false;
	this.lastBlock = null;
	this.isJumping = false;
	this.isFalling = true;
}

// inherit Persion
Ball.prototype = new THREE.Mesh();
Ball.prototype.constructor = Ball;

Ball.prototype.touchPoint = function() {
	
	return new THREE.Vector3(  
		
		this.position.x + this.geometry.radius,
		this.position.y,
		this.position.z + this.geometry.radius
	);
}

Ball.prototype.nextTouchPoint = function() {
	
	return new THREE.Vector3(
		                                                          
		this.touchPoint().x + speedX,
		this.touchPoint().y,
		this.touchPoint().z + speedZ
	);
}                     
         
// Rotate an object around an arbitrary axis in world space       
Ball.prototype.rotateAroundWorldAxis = function(axis, radians) {
	
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(this.matrix);        // pre-multiply
    this.matrix = rotWorldMatrix;
    this.rotation.setFromRotationMatrix(this.matrix);
}         

Ball.prototype.blockUnderBall = function(trackPosition) {

	var pos = this.touchPoint();              
	var posOnTrack = new THREE.Vector3( 
		pos.x - trackPosition.x,
		pos.y - trackPosition.y,
		pos.z - trackPosition.z
	);                           
	if (posOnTrack.x >= 0 && posOnTrack.z >= 0 && posOnTrack.y >= 0) {
		
		var block = track.blockForPosition(parseInt(posOnTrack.x, 10), parseInt(posOnTrack.z, 10));
		if (block) {
			
			this.lastBlock = block;
			return block;
		}                  
	} 
	return null;
}