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
		(-trackPosition.x+(CONFIG.BLOCK_SIZE/2)),
		-trackPosition.y,
		(-trackPosition.z+(CONFIG.BLOCK_SIZE/2))
	);
	if (posOnTrack.x >= 0 && posOnTrack.y >= 0) {
		
		var block = track.blockForPosition(
			parseInt(posOnTrack.x/CONFIG.BLOCK_SIZE, 10), 
			parseInt(posOnTrack.z/CONFIG.BLOCK_SIZE, 10)
		);
		if (block) {
			
			if (trackPosition.y <= 0) {
				
				// $("#debug").html(block.blockType.name);
				var now = new Date().getTime();
				switch (block.blockType.name) {
					
					case "jumper":
						
						this.isJumping = true;
						speedY = -1*CONFIG.JUMP_SPEED;
						break;
					
					case "slowdown":
						
						slowdownEndTime = now + 5000;
						if (trackSpeed >= CONFIG.TRACK_SPEED) {
							
							trackSpeed /= 2;
							slowdownTimer = window.setTimeout(function() {
							
								if (warpEndTime <= 0) {
									
									trackSpeed *= 2;
									slowdownEndTime = 0;	
								}
							}, 5000);
						}
						break;
					
					case "speedup":
						
						speedupEndTime = now + 5000;
						if (trackSpeed <= CONFIG.TRACK_SPEED) {
							
							trackSpeed *= 2;
							speedupTimer = window.setTimeout(function() {
							
								if (warpEndTime <= 0) {
									
									trackSpeed /= 2;
									speedupEndTime = 0;	
								}
							}, 5000);
						}
						break;
					
					case "invertor":
						
						invertorEndTime = now + 5000;
						if (controlDirection == 1) {
							
							controlDirection = -1;
							invertorTimer = window.setTimeout(function() {
							
								controlDirection = 1;
								invertorEndTime = 0;	
							}, 5000);
						}
						break;
					
					case "warp":
						
						warpEndTime = now + 5000;
						speedupEndTime = 0;
						slowdownEndTime = 0;
						trackSpeed = 1.3;
						warpTimer = window.setTimeout(function() {
						
							trackSpeed = CONFIG.TRACK_SPEED;
							warpEndTime = 0;	
						}, 5000);
						break;
				}
				Util.updateInfoHTML();
			}		
			
			this.lastBlock = block;
			return block;
		}                  
	} 
	return null;
}