/**
  *  Track - the playground
  **/
function Track() {
	       
	// call parent constructor
	THREE.Object3D.call(this);
	this.receiveShadow = true;
	this.blocks = new Array();
	this.activeRow = null;
	this.frontRows = CONFIG.TRACK.FRONT_ROWS;
	this.backRows = CONFIG.TRACK.BACK_ROWS;
	var level = "01010\n"
	+ "10101\n"
	+ "01010\n"
	+ "10101\n"
	+ "01010\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23432\n"
	+ "34443\n"
	+ "23432\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "39993\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "25552\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "27672\n"
	+ "32323\n"
	+ "  2\n"
	+ "38383\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n"
	+ "32323\n"
	+ "23232\n";
	
	var rows = level.split("\n");
	
	var blockRow;
   	for (var row = 0; row < rows.length; row++) {
	        
		blockRow = new Array();
	   	for (var col = 0; col < rows[row].length; col++) {
            
			if (!isNaN(parseInt(rows[row].charAt(col), 10))) {
				
				var type = parseInt(rows[row].charAt(col), 10);                       
				var block = new Block(CONFIG.BLOCK_TYPES[type], new THREE.Vector3(
					col*CONFIG.BLOCK_SIZE, 
					0, 
					row*CONFIG.BLOCK_SIZE
				)); 
				blockRow.push(block);
			}
			else {
				
				blockRow.push(null);
			}
		}
		this.blocks.push(blockRow);
	} 
	this.position = new THREE.Vector3(
		-1*CONFIG.BLOCK_SIZE*(Math.floor(this.blocks[this.blocks.length-3].length/2)), 
		0, 
		-1*CONFIG.BLOCK_SIZE*(this.blocks.length-3));
}

// inherit Persion
Track.prototype = new THREE.Object3D();
Track.prototype.constructor = Track;       

Track.prototype.blockForPosition = function(col, row) {
	        
	var block = this.blocks[row] ? this.blocks[row][col] : null;
	if (block && col >= 0 && row >= 0) {
		
		return block;
	}
	return null;                                                      
} 

Track.prototype.updateBlocks = function() {
	                 
	var currentBlock = ball.blockUnderBall(this.position);
	if (currentBlock && (currentBlock.position.z/CONFIG.BLOCK_SIZE != this.activeRow)) {
		
		this.activeRow = currentBlock.position.z/CONFIG.BLOCK_SIZE;
	   	for (var row = 0; row < this.blocks.length; row++) {

			blockRow = new Array();
		   	for (var col = 0; col < this.blocks[row].length; col++) {
                         
				var block = this.blocks[row][col];
				if (block) {

					this.remove(block);
				}
			}
   		}  
	   	for (var row = (this.activeRow-this.frontRows); row < (this.activeRow+this.backRows); row++) {

			blockRow = new Array();
			if (this.blocks[row]) {
				
			   	for (var col = 0; col < this.blocks[row].length; col++) {

					var block = this.blocks[row][col];
					if (block) {

						this.add(block);
					}
				}
			}
   		}         
	}                
}
   
Track.prototype.nextPosition = function() {
	
	var nextPosition = new THREE.Vector3(
		this.position.x+(speedX*speedModifier),
		this.position.y,
		this.position.z+(speedZ*speedModifier)
	);
	var floorPosY = 5;
	var timeRate = timeDifference / 1000;
	if (timeRate) {
		
		tempSpeedX = (nextPosition.x - this.position.x)*timeRate;           
		tempSpeedY = (nextPosition.y - this.position.y)*timeRate;           
		tempSpeedZ = (nextPosition.z - this.position.z)*timeRate;           
		nextPosition.x = this.position.x + tempSpeedX;          
		nextPosition.y = this.position.y + tempSpeedY;          
		nextPosition.z = this.position.z + tempSpeedZ;
		
	}
	var nextBlock = ball.blockUnderBall(nextPosition);
	if (nextBlock) {
		
		floorPosY = (-1*(nextBlock.blockHeight/2)) - .01;
	}
	if (ball.isJumping) {
	
		if (ball.isFalling) {
		
			nextY = -1*CONFIG.JUMP_SPEED;
			speedY = nextY;
			ball.isFalling = false;
			ball.inAir = true;
		}
		else if ((speedY < CONFIG.FALLING_SPEED_TRIGGER) && (nextY >= nextPosition.y)) {
		
			speedY /= CONFIG.JUMP_ACCELERATION;
			nextY += speedY;
		}
		else if (speedY >= CONFIG.FALLING_SPEED_TRIGGER) {
		
			ball.isFalling = true;
		}
	}
	if (ball.isFalling){
	
		if (ball.inAir) {
		
			if (ball.isJumping) {
		
				ball.isJumping = false;
				speedY *= -1
			}	
			else if ((speedY < CONFIG.GRAVITY) && (nextY <= nextPosition.y)) {
		
				speedY *= CONFIG.JUMP_ACCELERATION;
				nextY += speedY;
			}
		}
	}
	
	if (timeRate) {
		
		tempSpeedY = speedY*timeRate;           
		nextPosition.y = this.position.y + tempSpeedY;          
	}
	
	if (ball.isFalling){
		
		if (nextBlock && nextPosition.y >= floorPosY) {
	
			nextY = 0;
			ball.inAir = false;
			nextPosition.y = floorPosY;
			speedY = CONFIG.GRAVITY;
			canMove = {
		
				back: true,
				front: true,
				left: true,
				right: true
			};
			if (warpEndTime <= 0) {
				
				nextPosition = nextBlock.getNextPositionToBall(nextPosition);
			}
		}
	}	
		
	if (!nextBlock && (track.position.y > 0)) {

		if (warpEndTime <= 0) {
			
	    	nextPosition = this.getBallBlockFallingPosition(nextPosition);
			if (nextPosition.y > 2) {

				clearGame();
			} 
		}
		else {
			
			nextY = 0;
			speedY = 0;
			tempSpeedY = 0;
			ball.inAir = false;
			nextPosition.y = (floorPosY >= 5 ? 0 : floorPosY);
		}
	}
	
	return nextPosition;
}

Track.prototype.getBallBlockFallingPosition = function(nextPosition, lastBlock) {
	                                    
	var ballPos = Util.getBallPosition(nextPosition);
	                                    
	if (!lastBlock) {
		
		lastBlock = ball.lastBlock;
		var neighbourBlocks = lastBlock.neighbourBlocks();
		for (var block in neighbourBlocks) {

			if (neighbourBlocks[block]) {
				
				nextPosition = this.getBallBlockFallingPosition(nextPosition, neighbourBlocks[block]);
			}
		}
	}   
	var collisionTypes = Util.getCollisions(lastBlock, new THREE.Vector3(
		nextPosition.x, 
		nextPosition.y+speedY, 
		nextPosition.z
	));
	var timeRate = timeDifference/1000;
	var blockPos = lastBlock.position;
	var lambda = null;
	for (var i = 0; i < collisionTypes.length; i++) {
	
		switch(collisionTypes[i]) { 
			
			case "back":
			case "backLeft":
			case "backRight":     
			
				speedZ = CONFIG.ACCELERATION*timeRate;
				lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.front, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              
			
			case "front":
			case "frontLeft":
			case "frontRight":     

				speedZ = -1*CONFIG.ACCELERATION*timeRate;
				lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.back, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              

			case "left":
			case "backLeft":
			case "frontLeft":     

				speedX = -1*CONFIG.ACCELERATION*timeRate;
				lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.right, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              

			case "right":        
			case "backRight":
			case "frontRight":
                 
				speedX = CONFIG.ACCELERATION*timeRate;
				lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.left, 2))/(this.position.y+CONFIG.GRAVITY);
				break
		}
		nextPosition.x += speedX;
		nextPosition.z += speedZ;
	}
	if (lambda && lambda != Infinity && lambda < 1) {
		
		nextPosition.y += (speedY - (lambda * speedY))-speedY;
	}
	return nextPosition;
}
