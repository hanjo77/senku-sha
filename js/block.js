/**
 * The block, a tile of the track
 * @author Hanjo
 * @version $Rev$
 * @requires OtherClassName
 */

function Block(type, pos) {
	       
	// call parent constructor
	THREE.Mesh.call(this);
	this.blockHeight = (type.height ? type.height : CONFIG.BLOCK_HEIGHT)
	this.geometry = new THREE.CubeGeometry(CONFIG.BLOCK_SIZE,this.blockHeight,CONFIG.BLOCK_SIZE);
	this.position = new THREE.Vector3(           
		(pos.x ? pos.x : 0),
		-1*CONFIG.BLOCK_HEIGHT/2,
		(pos.z ? pos.z : 0)
	);                                        
	this.material = new THREE.MeshLambertMaterial({color: (type.color ? type.color : 0x000000)});      
	this.castShadow		= false;
	this.receiveShadow	= true;
	this.blockType = type;                
    this.left = this.position.x-(CONFIG.BLOCK_SIZE/2);
	this.right = this.left+CONFIG.BLOCK_SIZE;
	this.front = this.position.z-(CONFIG.BLOCK_SIZE/2);
	this.back = this.front+CONFIG.BLOCK_SIZE;
}

// inherit Mesh
Block.prototype = new THREE.Mesh();
Block.prototype.constructor = Block;           

/**
 * Returns an object containing the neighbour blocks
 * @returns This blocks neighbour blocks
 * @type Object
 */

Block.prototype.neighbourBlocks = function() {
                                                      
	var col = parseInt(this.position.x/CONFIG.BLOCK_SIZE, 10);
	var row = parseInt(this.position.z/CONFIG.BLOCK_SIZE, 10);
	return {                                    
 	    frontLeft: track.blockForPosition(col-1, row-1),
		frontRight: track.blockForPosition(col+1, row-1),
		backLeft: track.blockForPosition(col-1, row+1),
		backRight: track.blockForPosition(col+1, row+1),
    	front: track.blockForPosition(col, row-1),
		left: track.blockForPosition(col-1, row),
		right: track.blockForPosition(col+1, row),
		back: track.blockForPosition(col, row+1)
	};      
}           

/**
 * Finds the next track position, calculated by distance between this block and ball
 * @param {THREE.Vector3} nextPos the track position in the next frame
 * @param {String} type Type of collision (top|bottom|left|right|topLeft|topRight|bottomLeft|bottomRight)
 * @returns Updated track position
 * @type THREE.Vector3
 */

Block.prototype.getNextPositionToBall = function(nextPos, type) {
	
	if (!type && warpEndTime <= 0) {
		
		$("#debug").html(this.blockType.name);
		var neighbours = this.neighbourBlocks();
		for (var type in neighbours) {
			
			if (neighbours[type]) {
				
				nextPos = neighbours[type].getNextPositionToBall(nextPos, type);
			}
		}
	}
	if (this.blockType.name == "blocker") {
		
		var ballPos = Util.getBallPosition(nextPos);     
		var floorIntersection = (track.position.y > (-1*this.blockHeight/2));
		var collisionTypes = Util.getCollisions(this, nextPos);
		if (floorIntersection) {

			for (var i = 0; i < collisionTypes.length; i++) {

				switch(collisionTypes[i]) {

					case "frontLeft":

						if (speedX > 0 || speedZ > 0) {
		
							if (Math.abs(speedX) > Math.abs(speedZ)) {

								nextPos.z = (this.back+ball.geometry.radius)*-1;
								speedZ = 0;                                             
								canMove.back = false;                                             
								tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.right+ball.geometry.radius)*-1;
								speedX = 0;                                             
								canMove.left = false;                                             
								tempSpeedX = speedX;
 							} 
						}
						break;    

					case "frontRight":

						if (speedX < 0 || speedZ > 0) {						

							if (Math.abs(speedX) > Math.abs(speedZ)) {

								nextPos.z = (this.back+ball.geometry.radius)*-1;
								speedZ = 0;                                             
								canMove.back = false;                                             
								tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.left-ball.geometry.radius)*-1;
								speedX = 0;
								canMove.right = false;                                             
								tempSpeedX = speedX;
							}
						}
						break;    

					case "backLeft":
			
						if (speedX > 0 || speedZ < 0) {
		
							if (Math.abs(speedX) > Math.abs(speedZ)) {

								nextPos.z = (this.front-ball.geometry.radius)*-1;
								speedZ = 0;                                             
								canMove.front = false;                                             
								tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.right+ball.geometry.radius)*-1;
								speedX = 0;                                             
								canMove.left = false;                                             
								tempSpeedX = speedX;
							}
						}
						break;    

					case "backRight":

						if (speedX < 0 || speedZ < 0) {
		
							if (Math.abs(speedX) > Math.abs(speedZ)) {

								nextPos.z = (this.front-ball.geometry.radius)*-1;
								speedZ = 0;                                             
								canMove.front = false;                                             
								tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.left-ball.geometry.radius)*-1;
								speedX = 0;
								canMove.right = false;                                             
								tempSpeedX = speedX;
							}
						}
						break;
						
					case "right":

						if (speedX <= 0) {
		
							nextPos.x = (this.left-ball.geometry.radius)*-1;
							speedX = 0;
							canMove.right = false;                                             
							tempSpeedX = speedX;
						}
						break;    

					case "left":

						if (speedX >= 0) {
		
							nextPos.x = (this.right+ball.geometry.radius)*-1;
							speedX = 0;                                             
							canMove.left = false;                                             
							tempSpeedX = speedX;
						}
						break;    

					case "back":

						if (speedZ >= 0) {
		
							nextPos.z = (this.back+ball.geometry.radius)*-1;
							lastZ = nextPos.z;                                             
							speedZ = -1;
							tempSpeedZ = speedZ*timeRate;
							nextPos.z += tempSpeedZ;
							canMove.back = false;                                             
							tempSpeedZ = speedZ;
						}
						break;    

					case "front":

						if (speedZ <= 0) {
		
							nextPos.z = (this.front-ball.geometry.radius)*-1;
							speedZ = 0;                                             
							canMove.front = false;
						}
						break;    
				}		
			}
		}
	}
	                                   
	return nextPos;
}             