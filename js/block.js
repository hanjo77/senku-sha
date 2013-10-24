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
		var floorIntersection = (game.track.position.y > (-1*this.blockHeight/2));
		var collisionTypes = Util.getCollisions(this, nextPos);
		if (floorIntersection) {

			for (var i = 0; i < collisionTypes.length; i++) {

				switch(collisionTypes[i]) {

					case "frontLeft":

						if (game.track.speedX > 0 || game.track.speedZ > 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.back+game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.ball.canMove.back = false;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.right+game.ball.geometry.radius)*-1;
								game.track.speedX = 0;                                             
								game.ball.canMove.left = false;                                             
								game.track.tempSpeedX = game.track.speedX;
 							} 
						}
						break;    

					case "frontRight":

						if (game.track.speedX < 0 || game.track.speedZ > 0) {						

							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.back+game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.ball.canMove.back = false;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.left-game.ball.geometry.radius)*-1;
								game.track.speedX = 0;
								game.ball.canMove.right = false;                                             
								game.track.tempSpeedX = game.track.speedX;
							}
						}
						break;    

					case "backLeft":
			
						if (game.track.speedX > 0 || game.track.speedZ < 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								nextPos.z = (this.front-game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.ball.canMove.front = false;                                             
								game.track.tempSpeedZ = game.track.speedZ;
							}
							else {

								nextPos.x = (this.right+game.ball.geometry.radius)*-1;
								game.track.speedX = 0;                                             
								game.ball.canMove.left = false;                                             
								game.track.tempSpeedX = game.track.speedX;
							}
						}
						break;    

					case "backRight":

						if (game.track.speedX < 0 || game.track.speedZ < 0) {
		
							if (Math.abs(game.track.speedX) > Math.abs(game.track.speedZ)) {

								game.track.nextPos.z = (this.front-game.ball.geometry.radius)*-1;
								game.track.speedZ = 0;                                             
								game.ball.canMove.front = false;                                             
								game.track.tempSpeedZ = speedZ;
							}
							else {

								nextPos.x = (this.left-game.ball.geometry.radius)*-1;
								game.track.speedX = 0;
								game.ball.canMove.right = false;                                             
								game.track.tempSpeedX = game.track.speedX;
							}
						}
						break;
						
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

					case "back":

						if (game.track.speedZ >= 0) {
		
							nextPos.z = (this.back+game.ball.geometry.radius)*-1;
							game.track.lastZ = nextPos.z;                                             
							game.track.speedZ = -1;
							game.track.tempSpeedZ = game.track.speedZ*game.timeRate;
							nextPos.z += game.track.tempSpeedZ;
							game.ball.canMove.back = false;                                             
							game.track.tempSpeedZ = game.track.speedZ;
						}
						break;    

					case "front":

						if (game.track.speedZ <= 0) {
		
							nextPos.z = (this.front-game.ball.geometry.radius)*-1;
							game.track.speedZ = 0;                                             
							game.ball.canMove.front = false;
						}
						break;    
				}		
			}
		}
	}
	                                   
	return nextPos;
}             