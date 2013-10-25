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
	this.canMove = {
		
		back: true,
		front: true,
		left: true,
		right: true
	};
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
		
		var block = game.track.blockForPosition(
			parseInt(posOnTrack.x/CONFIG.BLOCK_SIZE, 10), 
			parseInt(posOnTrack.z/CONFIG.BLOCK_SIZE, 10)
		);
		if (block) {
			
			if (game && trackPosition.y <= 0 && !this.inAir && !game.isInGoal) {
				
				var now = new Date().getTime();					
				switch (block.blockType.name) {
				
					case "jumper":
					
						if (game.warpEndTime <= 0) {
							
							this.isJumping = true;
						}
						break;
				
					case "slowdown":
					
						if (game.track.speedModifier >= 1 && game.warpEndTime <= 0) {
						
							game.slowdownEndTime = now + 5000;
							game.track.speedModifier /= 1.5;
							window.clearTimeout(game.slowdownTimer);
							game.slowdownTimer = window.setTimeout(function() {
						
								if (game.warpEndTime <= 0) {
								
									game.track.speedModifier *= 1.5;
									game.slowdownEndTime = 0;	
								}
							}, 5000);
						}
						break;
				
					case "speedup":
					
						if (game.track.speedModifier <= 1 && game.warpEndTime <= 0) {
						
							game.speedupEndTime = now + 5000;
							game.track.speedModifier *= 1.5;
							window.clearTimeout(game.speedupTimer);
							game.speedupTimer = window.setTimeout(function() {
						
								if (game.warpEndTime <= 0) {
								
									game.track.speedModifier /= 1.5;
									game.speedupEndTime = 0;	
								}
							}, 5000);
						}
						break;
				
					case "invertor":
					
						if (game.controlDirection == 1 && game.warpEndTime <= 0) {
						
							game.invertorEndTime = now + 5000;
							game.controlDirection = -1;
							window.clearTimeout(game.invertorTimer);
							game.invertorTimer = window.setTimeout(function() {
						
								game.controlDirection = 1;
								game.invertorEndTime = 0;	
							}, 5000);
						}
						break;
				
					case "warp":
					
						game.warpEndTime = now + 5000;
						game.speedupEndTime = 0;
						game.slowdownEndTime = 0;
						game.track.speedModifier = 2;
						window.clearTimeout(game.warpTimer);
						game.warpTimer = window.setTimeout(function() {
					
							game.track.speedModifier = 1;
							game.warpEndTime = 0;	
						}, 5000);
						break;
				
					case "goalBright":
					case "goalDark":
					
						if (game.startTime > 0) {
							
							game.track.finishLevel();
						}
						break;
				}
			}
			else if (game && game.isInGoal) {
				
				if (block.blockType.name.indexOf("goal") == -1) {
					
					console.log(block.blockType.name);
					game.startTime = 0;
					game.isInGoal = false;
					game.startTime = new Date();
				}
			}		
			
			this.lastBlock = block;
			return block;
		}                  
	} 
	return null;
}