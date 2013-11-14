/**
 * The block, a tile of the track
 * @author Hanjo
 * @version $Rev$
 * @requires OtherClassName
 * @constructor
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
	this.front = this.position.z;
	this.back = this.front+CONFIG.BLOCK_SIZE;
	this.neighbours = {};
}

// inherit THREE.Mesh
Block.prototype = new THREE.Mesh();
Block.prototype.constructor = Block;           

/**
 * Updates the neighbour blocks
 * @type Object
 */

Block.prototype.updateNeighbours = function() {
                                                      
	var col = parseInt(this.position.x/CONFIG.BLOCK_SIZE, 10);
	var row = parseInt(this.position.z/CONFIG.BLOCK_SIZE, 10);
	this.neighbours = {                                    
 	    frontLeft: game.track.blockForPosition(col-1, row-1),
		frontRight: game.track.blockForPosition(col+1, row-1),
		backLeft: game.track.blockForPosition(col-1, row+1),
		backRight: game.track.blockForPosition(col+1, row+1),
    	front: game.track.blockForPosition(col, row-1),
		left: game.track.blockForPosition(col-1, row),
		right: game.track.blockForPosition(col+1, row),
		back: game.track.blockForPosition(col, row+1)
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
	
	if (!type && game.warpEndTime <= 0) {
		
		for (var dir in this.neighbours) {
			
			if (this.neighbours[dir]) {
				
				nextPos = this.neighbours[dir].getNextPositionToBall(nextPos, dir);
			}
		}
	}
	if (this.blockType.name == "blocker") {
		
		var ballPos = Util.getBallPosition(nextPos);     
		var floorIntersection = (game.track.position.y >= (-1*this.blockHeight/2)-.5);
		var collisionTypes = Util.getCollisions(this, nextPos);
		if (floorIntersection) {

			for (var i = 0; i < collisionTypes.length; i++) {

				switch(collisionTypes[i]) {

					case "right":

						if (game.track.speedX <= 0) {
	
							nextPos.x = (this.left-game.ball.geometry.radius)*-1;
							game.track.speedX = 0;
							game.ball.canMove.right = false;                                             
							game.track.tempSpeedX = game.track.speedX;
						}
						break;    

					case "left":

						if (game.track.speedX >= 0) {
	
							nextPos.x = (this.right+game.ball.geometry.radius)*-1;
							game.track.speedX = 0;                                             
							game.ball.canMove.left = false;                                             
							game.track.tempSpeedX = game.track.speedX;
						}
						break;    

					case "front":

						if ((!type || type == "front") && game.track.speedZ >= 0) {
	
							nextPos.z = (this.back+(CONFIG.BLOCK_SIZE/2))*-1;
							nextPos.y = 0;
							game.track.lastZ = nextPos.z;                                             
							game.track.speedZ = 0;
							game.track.tempSpeedZ = game.track.speedZ*game.timeRate;
							nextPos.z += game.track.tempSpeedZ;
							game.ball.canMove.front = false;   
						}
						break;    

					case "back":

						if ((!type || type == "back") && game.track.speedZ <= 0) {
	
							nextPos.z = (this.front-game.ball.geometry.radius)*-1;
							game.track.speedZ = 0;                                             
							game.ball.canMove.back = false;
						}
						break;    

/*					case "frontLeft":

						if (game.track.speedX > 0 || game.track.speedZ > 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.back+game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.right+game.ball.geometry.radius)*-1;
								game.track.speedX = 0;                                             
								game.track.tempSpeedX = game.track.speedX;
 							} 
							game.ball.canMove.back = false;                                             
							game.ball.canMove.left = false;                                             
						}
						break;    

					case "frontRight":

						if (game.track.speedX < 0 || game.track.speedZ > 0) {						

							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.back+game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.left-game.ball.geometry.radius)*-1;
								game.track.speedX = 0;
								game.track.tempSpeedX = game.track.speedX;
							}
							game.ball.canMove.back = false;                                             
							game.ball.canMove.right = false;                                             
						}
						break;    

					case "backLeft":
			
						if (game.track.speedX > 0 || game.track.speedZ < 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.front-game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.right+game.ball.geometry.radius)*-1;
								game.track.speedX = 0;                                             
								game.track.tempSpeedX = game.track.speedX;
							}
							game.ball.canMove.front = false;                                             
							game.ball.canMove.left = false;                                             
						}
						break;    

					case "backRight":

						if (game.track.speedX < 0 || game.track.speedZ < 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								game.track.nextPos.z = (this.front-game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.track.tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.left-game.ball.geometry.radius)*-1;
								game.track.speedX = 0;
								game.track.tempSpeedX = game.track.speedX;
							}
							game.ball.canMove.front = false;                                             
							game.ball.canMove.right = false;                                             
						}
						break; */
				}		
			}
		}
	}
	                                   
	return nextPos;
}             