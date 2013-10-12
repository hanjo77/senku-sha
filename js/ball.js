/**
 * The ball - our great main actor
 * @author Hanjo
 * @version $Rev$
 * @requires OtherClassName
 */

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
	this.inAir = false;
}

// inherit Mesh
Ball.prototype = new THREE.Mesh();
Ball.prototype.constructor = Ball;

/**
 * The point directly under the ball
 * @returns Vector3 object of the ball's bottom touch point
 * @type THREE.Vector3
 */

Ball.prototype.touchPoint = function() {
	
	return new THREE.Vector3(  
		
		this.position.x + this.geometry.radius,
		this.position.y,
		this.position.z + this.geometry.radius
	);
}

/**
 * The point that will be under the ball in the next frame
 * @returns Vector3 object of the ball's next bottom touch point
 * @type THREE.Vector3
 */

Ball.prototype.nextTouchPoint = function() {
	
	return new THREE.Vector3(
		                                                          
		this.touchPoint().x + speedX,
		this.touchPoint().y,
		this.touchPoint().z + speedZ
	);
}                     
         
/**
 * Rotate ball around an arbitrary axis in world space
 * @param {THREE.Vector3} axis The axis
 * @param {Number} radians The angle in radians
 */
      
Ball.prototype.rotateAroundWorldAxis = function(axis, radians) {
	
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(this.matrix);        // pre-multiply
    this.matrix = rotWorldMatrix;
    this.rotation.setFromRotationMatrix(this.matrix);
}         

/**
 * Finds block under the ball
 * @param {THREE.Vector3} trackPosition Position of the track
 * @returns Block under ball
 * @type Block
 */

Ball.prototype.blockUnderBall = function(trackPosition) {

	var pos = this.touchPoint();              
	var posOnTrack = new THREE.Vector3( 
		pos.x - trackPosition.x,
		pos.y - trackPosition.y,
		pos.z - trackPosition.z
	);                        
	if (posOnTrack.x >= 0 && posOnTrack.y >= 0) {
		
		var block = track.blockForPosition(
			parseInt(posOnTrack.x/CONFIG.BLOCK_SIZE, 10), 
			parseInt(posOnTrack.z/CONFIG.BLOCK_SIZE, 10)
		);
		if (block) {
			
			if (trackPosition.y <= 0) {
				
				switch (block.blockType.name) {
					
					case "jumper":
						this.isJumping = true;
						speedY = -1*CONFIG.JUMP_SPEED;
						break;
				}
			}		
			
			this.lastBlock = block;
			return block;
		}                  
	} 
	return null;
}