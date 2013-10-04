/**
 * The block, a tile of the track
 * @author Hanjo
 * @version $Rev$
 * @requires OtherClassName
 */

function Block(type, pos) {
	       
	// call parent constructor
	THREE.Mesh.call(this);
	this.blockSize = CONFIG.BLOCK_SIZE;
	this.blockHeight = (type.height ? type.height : CONFIG.BLOCK_HEIGHT)
	this.geometry = new THREE.CubeGeometry(this.blockSize,this.blockHeight,this.blockSize);
	this.position = {           
		x: (pos.x ? pos.x : 0),
		y: -1*CONFIG.BLOCK_HEIGHT/2,
		z: (pos.z ? pos.z : 0)
	}                                        
	this.material = new THREE.MeshLambertMaterial({color: (type.color ? type.color : 0x000000)});      
	this.castShadow		= false;
	this.receiveShadow	= true;
	this.blockType = type;                
    this.left = this.position.x;
	this.right = this.position.x+this.blockSize;
	this.front = this.position.z;
	this.back = this.position.z+this.blockSize;
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
                                                      
	var col = parseInt(this.position.x, 10);
	var row = parseInt(this.position.z, 10);
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
 * @param {String} type Type of collision (top|bottom|left|right|topLeft|topRight|bottomLeft|bottomRight)
 * @param {THREE.Vector3} nextPos the track position in the next frame
 * @returns Updated track position
 * @type THREE.Vector3
 */

Block.prototype.getNextPositionToBall = function(type, nextPos) {
	    
	var ballPos = Util.getBallPosition(nextPos);     
	var floorIntersection = (track.position.y > (-1*this.blockHeight/2) + .1);
	var collisionTypes = Util.getCollisions(this, nextPos);
	if (floorIntersection) {
		
		for (var i = 0; i < collisionTypes.length; i++) {
		
			if (collisionTypes[i] == type) {

				switch(type) {

					case "frontLeft":

						if (Math.abs(speedX) > Math.abs(speedZ)) {

							nextPos.z = -1*((Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(this.right-ballPos.x, 2)))+this.back)-ball.geometry.radius);
							speedZ = nextPos.z - track.position.z;                                             
						}
						else {

							nextPos.x = (-1*(Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(this.back-ballPos.z, 2)))+this.right))+ball.geometry.radius;
							speedX = nextPos.x - track.position.x;
						} 
						break;    

					case "frontRight":

						if (Math.abs(speedX) > Math.abs(speedZ)) {

							nextPos.z = -1*((Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(this.left-ballPos.x, 2)))+this.back)-ball.geometry.radius);
							speedZ = nextPos.z - track.position.z;                                             
						}
						else {

							nextPos.x = ball.geometry.radius+(Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(ballPos.z-this.back, 2)))-this.left);
							speedX = nextPos.x - track.position.x;
						}
						break;    

					case "backLeft":

						if (Math.abs(speedX) > Math.abs(speedZ)) {

							nextPos.z = (Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(this.right-ballPos.x, 2)))-this.front)+ball.geometry.radius;
							speedZ = 0;
						}
						else {

							nextPos.x = -1*((Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(ballPos.z-this.front, 2)))+this.right)-ball.geometry.radius);
							speedX = 0;
						}
						break;    

					case "backRight":

						if (Math.abs(speedX) > Math.abs(speedZ)) {

							nextPos.z = ball.geometry.radius+(Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(this.left-ballPos.x, 2)))-this.front);
							speedZ = 0;
						}
						else {

							nextPos.x = ball.geometry.radius+(Math.sqrt(Math.abs(Math.pow(ball.geometry.radius, 2)-Math.pow(ballPos.z-this.front, 2)))-this.left);
							speedX = 0;                                    
						}
						break;
				}    
			}
			switch(type) {

				case "right":

					nextPos.x = (this.left-this.blockSize)*-1;
					speedX = nextPos.x - track.position.x;                                             
					break;    

				case "left":

					nextPos.x = this.right*-1;
					speedX = nextPos.x - track.position.x;                                             
					break;    

				case "back":

					nextPos.z = (this.front-this.blockSize)*-1;
					speedZ = nextPos.z - track.position.z;                                             
					break;    

				case "front":

					nextPos.z = this.back*-1;
					speedZ = nextPos.z - track.position.z;                                             
					break;    
			}		
	   	}         
	}                                     
	return nextPos;
}             