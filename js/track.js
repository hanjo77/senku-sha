/**
  *  Track - the playground
  **/
function Track() {
	       
	// call parent constructor
	THREE.Object3D.call(this);
	this.lastY = null;
	this.lastZ = null;
	this.trackSpeed = CONFIG.TRACK_SPEED;
	this.speedModifier = 1;
	this.speedX = 0;
	this.speedY = 0;
	this.speedZ = 0;
	this.tempSpeedX = 0;
	this.tempSpeedY = 0;
	this.tempSpeedZ = 0;
	this.oldSpeedY;
	this.nextX = null;
	this.nextY = null;
	this.receiveShadow = true;
	this.blocks = [];
	this.activeRow = null;
	this.isStarted;
	this.isStopped;
	this.frontRows = CONFIG.TRACK.FRONT_ROWS;
	this.backRows = CONFIG.TRACK.BACK_ROWS;
	this.loadLevel();
}

// inherit Persion
Track.prototype = new THREE.Object3D();
Track.prototype.constructor = Track;       

Track.prototype.loadLevel = function() {
	
	$.ajax({
		
		url: "load_level.php",
		type: "POST",
		data: {
			
			id: (game ? game.currentLevel : 1)
		}
	}).done(function(result) {
		
		if (game) {
			
			game.track.initLevel(eval("(" + result + ")"));
		}
	});	
}

Track.prototype.finishLevel = function() {
	
	this.isStarted = false;
	this.speedX = 0;
	this.speedZ = 0;
	this.tempSpeedX = 0;
	this.tempSpeedZ = 0;
	this.speedModifier = 1;
	game.isInGoal = true;
	game.warpEndTime = null;
	game.invertorEndTime = null;
	game.slowdownEndTime = null;
	game.speedupEndTime = null;
	game.controlDirection = 1;
	game.container.append('<div class="over></div>')
	window.clearTimeout(game.invertorTimer);
	window.clearTimeout(game.slowdownTimer);
	window.clearTimeout(game.warpTimer);
	window.clearTimeout(game.speedupTimer);
	Util.updateInfoHTML();
	
	if (game.nextLevel) {
		
		game.currentLevel = game.nextLevel;
		this.loadLevel();
	}
	else {
		
		this.nextX = -1*CONFIG.BLOCK_SIZE*(Math.floor(this.blocks[this.blocks.length-4].length/2));
		this.nextZ = -4*CONFIG.BLOCK_SIZE;
	}
}

Track.prototype.start = function() {
	
	this.isStarted = true;
	if (game.ball.canMove.back) {
		
		this.speedZ = this.trackSpeed;
	}
	if (!game.startTime) {
		
		game.startTime = new Date();
	}
}
   
Track.prototype.initLevel = function(levelObj) {
	
	game.nextLevel = levelObj.nextLevel;
	game.currentLevel = levelObj.currentLevel;
	var level = levelObj.levelData;
	var rows = level.split("\n");

	var blockRow;
	this.blocks = [];
   	for (var row = 0; row < rows.length; row++) {
    
		blockRow = [];
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
	if (!this.isInitialized) {
		
		this.position = new THREE.Vector3(
			-1*CONFIG.BLOCK_SIZE*(Math.floor(this.blocks[this.blocks.length-4].length/2)), 
			0, 
			-1*CONFIG.BLOCK_SIZE*(this.blocks.length-6)
		);
		this.isInitialized = true;
	}
	else {
		
		this.position.z = -1*CONFIG.BLOCK_SIZE*(this.blocks.length-2);
		this.nextX = -1*CONFIG.BLOCK_SIZE*(Math.floor(this.blocks[this.blocks.length-4].length/2));
		this.nextZ = -1*CONFIG.BLOCK_SIZE*(this.blocks.length-6);
		while (this.children.length > 0) {
		
			this.remove(this.children[0]);
		}
	}
}

Track.prototype.blockForPosition = function(col, row) {
	        
	var block = this.blocks[row] ? this.blocks[row][col] : null;
	if (block && col >= 0 && row >= 0) {
		
		return block;
	}
	return null;                                                      
} 

Track.prototype.updateBlocks = function() {
	
	if (game) {
	
		var currentBlock = game.ball.blockUnderBall(this.position);
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
}

Track.prototype.nextGoalPosition = function() {
	
	var nextPos = new THREE.Vector3(
		this.position.x,
		this.position.y,
		this.position.z
	);
	if (game && game.timeRate) {
	
		var speed = CONFIG.TRACK_SPEED*game.timeRate;
		var distX = this.nextX-this.position.x;
		var distZ = this.nextZ-this.position.z;
		var distance = Math.sqrt(Math.pow(distX, 2)+Math.pow(distZ, 2));
		if (distance < speed) {
			
			nextPos = new THREE.Vector3(this.nextX, 0, this.nextZ);
		}
		else {
			
			nextPos.add(new THREE.Vector3(
			
				speed*distX/distance,
				0,
				speed*distZ/distance
			));
		}
		this.tempSpeedX = nextPos.x-this.position.x;
		this.tempSpeedZ = nextPos.z-this.position.z;
	}
	return nextPos;
}

Track.prototype.nextPosition = function() {
	
	var nextPosition;
	if (this.isStopped) {
		
		nextPosition = this.position;
	}
	else if (game) {
	
		nextPosition = new THREE.Vector3(
			this.position.x+(this.speedX*this.speedModifier),
			this.position.y,
			this.position.z+(this.speedZ*this.speedModifier)
		);
		var floorPosY = 5;
		if (game.timeRate) {
		
			if (this.speedZ < 0) {
			
				if ((nextPosition.z - this.lastZ) < this.speedZ) {
				
					this.speedZ /= 2;
					this.lastZ = nextPosition.z;
					if (this.speedZ > -0.5) {
					
						this.speedZ *= -1;
					}
				}
			}
			else if (this.speedZ > 0 && this.speedZ < CONFIG.TRACK_SPEED*this.speedModifier && game.ball.canMove.back) {

				if ((nextPosition.z - this.lastZ) > this.speedZ) {
				
					this.speedZ *= 2;
					this.lastZ = nextPosition.z;
				}
			}
			else if (game.startTime && this.speedZ == 0 && game.ball.canMove.back) {

				this.speedZ = CONFIG.TRACK_SPEED*this.speedModifier;
			}
			this.tempSpeedZ = this.speedZ*game.timeRate;
			this.tempSpeedX = (nextPosition.x - this.position.x)*game.timeRate;           
			this.tempSpeedY = (nextPosition.y - this.position.y)*game.timeRate;           
			this.tempSpeedZ = (nextPosition.z - this.position.z)*game.timeRate;           
			nextPosition.x = this.position.x + this.tempSpeedX;          
			nextPosition.y = this.position.y + this.tempSpeedY;          
			nextPosition.z = this.position.z + this.tempSpeedZ;
			
		}
		var nextBlock = game.ball.blockUnderBall(nextPosition);
		if (nextBlock) {
			
			floorPosY = (-1*(nextBlock.blockHeight/2)) - .01;
		}
		if (game.ball.isJumping) {
		
			if (game.ball.isFalling) {
			
				this.nextY = -1*CONFIG.JUMP_SPEED;
				this.speedY = this.nextY;
				game.ball.isFalling = false;
				game.ball.inAir = true;
			}
			else if ((this.speedY < CONFIG.FALLING_SPEED_TRIGGER) && (this.nextY >= nextPosition.y)) {
			
				this.speedY /= CONFIG.JUMP_ACCELERATION;
				this.nextY += this.speedY;
			}
			else if (this.speedY >= CONFIG.FALLING_SPEED_TRIGGER) {
			
				game.ball.isFalling = true;
			}
		}
		if (game.ball.isFalling){
		
			if (game.ball.inAir) {
			
				if (game.ball.isJumping) {
			
					game.ball.isJumping = false;
					this.speedY *= -1
				}	
				else if ((this.speedY < CONFIG.GRAVITY) && (this.nextY <= nextPosition.y)) {
			
					this.speedY *= CONFIG.JUMP_ACCELERATION;
					this.nextY += this.speedY;
				}
			}
		}
		
		if (game.timeRate) {
			
			this.tempSpeedY = this.speedY*game.timeRate;           
			nextPosition.y = this.position.y + this.tempSpeedY;          
		}
		
		if (game.ball.isFalling){
			
			if (nextBlock && nextPosition.y >= floorPosY) {
		
				this.nextY = 0;
				game.ball.inAir = false;
				nextPosition.y = floorPosY;
				this.speedY = CONFIG.GRAVITY;
				game.ball.canMove = {
			
					back: true,
					front: true,
					left: true,
					right: true
				};
				if (game.warpEndTime <= 0) {
					
					nextPosition = nextBlock.getNextPositionToBall(nextPosition);
				}
			}
		}	
			
		if (!nextBlock && (game.track.position.y > 0)) {

			if (game.warpEndTime <= 0) {
				
				nextPosition = this.getBallBlockFallingPosition(nextPosition);
				if (nextPosition.y > 1 && !this.isStopped) {

					// game.clearGame();
					this.oldSpeedY = this.speedY;
					this.speedX = 0;
					this.speedY = 0;
					this.speedZ = 0;
					this.isStopped = true;
					if (game.lives > 0) {
						
						game.lives--;
						window.setTimeout(function() {
						
							game.track.speedZ = CONFIG.TRACK_SPEED*game.track.speedModifier;
							game.track.speedY = -1;
							game.track.position.y = 0;
							game.track.position.z -= CONFIG.BLOCK_SIZE;
							console.log(game.track.speedY);
							game.ball.isJumping = true;
							game.track.isStopped = false;
						}, 1000);
					}
					else {
						
						Util.updateInfoHTML();							
					}
				} 
			}
			else {
				
				this.nextY = 0;
				this.speedY = 0;
				this.tempSpeedY = 0;
				game.ball.inAir = false;
				nextPosition.y = (floorPosY >= 5 ? 0 : floorPosY);
			}
		}
	}
			
	return nextPosition;
}

Track.prototype.getBallBlockFallingPosition = function(nextPosition, lastBlock) {
	                                    
	var ballPos = Util.getBallPosition(nextPosition);
	                                    
	if (!lastBlock) {
		
		lastBlock = game.ball.lastBlock;
		var neighbourBlocks = lastBlock.neighbourBlocks();
		for (var block in neighbourBlocks) {

			if (neighbourBlocks[block]) {
				
				nextPosition = this.getBallBlockFallingPosition(nextPosition, neighbourBlocks[block]);
			}
		}
	}   
	var collisionTypes = Util.getCollisions(lastBlock, new THREE.Vector3(
		nextPosition.x, 
		nextPosition.y+game.track.speedY, 
		nextPosition.z
	));
	var blockPos = lastBlock.position;
	var lambda = null;
	for (var i = 0; i < collisionTypes.length; i++) {
	
		switch(collisionTypes[i]) { 
			
			case "back":
			case "backLeft":
			case "backRight":     
			
				speedZ = CONFIG.ACCELERATION*game.timeRate;
				lambda = Math.sqrt(Math.pow(game.ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.front, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              
			
			case "front":
			case "frontLeft":
			case "frontRight":     

				speedZ = -1*CONFIG.ACCELERATION*game.timeRate;
				lambda = Math.sqrt(Math.pow(game.ball.geometry.radius, 2) - Math.pow(ballPos.z-lastBlock.back, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              

			case "left":
			case "backLeft":
			case "frontLeft":     

				speedX = -1*CONFIG.ACCELERATION*game.timeRate;
				lambda = Math.sqrt(Math.pow(game.ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.right, 2))/(this.position.y+CONFIG.GRAVITY);
				break;                                                              

			case "right":        
			case "backRight":
			case "frontRight":
                 
				speedX = CONFIG.ACCELERATION*game.timeRate;
				lambda = Math.sqrt(Math.pow(game.ball.geometry.radius, 2) - Math.pow(ballPos.x-lastBlock.left, 2))/(this.position.y+CONFIG.GRAVITY);
				break
		}
		nextPosition.x += game.track.speedX;
		nextPosition.z += game.track.speedZ;
	}
	if (lambda && lambda != Infinity && lambda < 1) {
		
		nextPosition.y += (game.track.speedY - (lambda * game.track.speedY))-game.track.speedY;
	}
	return nextPosition;
}
