/**
  *  Track - the playground
  **/
function Track() {
	       
	// call parent constructor
	THREE.Object3D.call(this);
	this.blocks = new Array();
	this.activeRow = null;
	this.frontRows = CONFIG.TRACK.FRONT_ROWS;
	this.backRows = CONFIG.TRACK.BACK_ROWS;
	var level = "2323232\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2104012\n"
	  + "3044403\n"
	  + "210 012\n"
	  + "30   03\n"
	  + "21   12\n"
	  + "30   03\n"
	  + "210 012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3010103\n"
	  + "2101012\n"
	  + "3232323";
	var rows = level.split("\n");
	
	var blockRow;
   	for (var row = 0; row < rows.length; row++) {
	        
		blockRow = new Array();
	   	for (var col = 0; col < rows[row].length; col++) {
            
			if (!isNaN(parseInt(rows[row].charAt(col), 10))) {
				
				var type = parseInt(rows[row].charAt(col), 10);                       
				var block = new Block(CONFIG.BLOCK_TYPES[type], new THREE.Vector3(col, 0, row)); 
				blockRow.push(block);
			}
			else {
				
				blockRow.push(null);
			}
		}
		this.blocks.push(blockRow);
	}                         
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
	if (currentBlock && (currentBlock.position.z != this.activeRow)) {
		
		this.activeRow = currentBlock.position.z;
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
	
	var nextPosition = this.position;
	nextPosition.x += speedX;
	nextPosition.y += speedY;
	nextPosition.z += speedZ;    
	var nextBlock = ball.blockUnderBall(nextPosition);
	if (!nextBlock) {
            
		if (track.position.y >= 0) {

	    	nextPosition = this.getBallBlockFallingPosition(nextPosition);
			if (track.position.y > 2) {
			
				clearGame();
			} 
		}
	}        
	else {
	
		var neighbours = nextBlock.neighbourBlocks();
		for (var neighbour in neighbours) {
		    
			var obj = neighbours[neighbour]; 
			if (obj && obj.blockType.blocker) {
                                 
				nextPosition = obj.getNextPositionToBall(neighbour, nextPosition);
			}
		}
	}
	return nextPosition;
}

Track.prototype.getBallBlockFallingPosition = function(nextPosition, lastBlock) {
	                                    
	var ballPos = Util.getBallPosition(nextPosition);
	nextPosition.y += CONFIG.GRAVITY;          
	                                    
	if (!lastBlock) {
		
		lastBlock = ball.lastBlock;
		var neighbourBlocks = lastBlock.neighbourBlocks();
		for (var i = 0; i < neighbourBlocks.length; i++) {

			nextPosition = this.getBallBlockFallingPosition(nextPosition, neighbourBlocks[i]);
		}
	}   
	if (lastBlock) {
		
		var collisionTypes = Util.getCollisions(lastBlock, new THREE.Vector3(nextPosition.x, nextPosition.y+CONFIG.GRAVITY, nextPosition.z));
		var blockPos = lastBlock.position;
		var lambda = null;
		
		for (var i = 0; i < collisionTypes.length; i++) {
		
			switch(collisionTypes[i]) { 
				
				case "back":
				case "backLeft":
				case "backRight":     
				
					lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.front, 2))/(this.position.y+CONFIG.GRAVITY);
					break;                                                              
				
				case "front":
				case "frontLeft":
				case "frontRight":     

					lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.back, 2))/(this.position.y+CONFIG.GRAVITY);
					break;                                                              

				case "left":
				case "backLeft":
				case "frontLeft":     

					lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.right, 2))/(this.position.y+CONFIG.GRAVITY);
					break;                                                              

				case "right":        
				case "backRight":
				case "frontRight":
                     
					lambda = Math.sqrt(Math.pow(ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.left, 2))/(this.position.y+CONFIG.GRAVITY);
					break
			}
		}
		if (lambda && lambda != Infinity) {
			
			nextPosition.y = ballPos.y - (lambda * (this.position.y+CONFIG.GRAVITY));
		}              
   		speedX *= 1.07;
		speedZ *= 1.07;
	}   
   	return nextPosition;
}
