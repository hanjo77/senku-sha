function Util() {

}

Util.removeChilds = function(obj) {

	for (var child in obj.children) {
	
		Util.removeChilds(obj.children[child]);
	}
	
	if (obj.parent) {
	
		obj.parent.remove(obj);
	}
	
	if (obj.geometry) {
		
		obj.geometry.dispose();
	}                        
	
	if (obj.material) {
		
		obj.material.dispose();
	}                        
	
	if (obj.texture) {
		
		obj.texture.dispose();
	}                        
	
	if (obj.dispose) {
	
		obj.dispose();
	}
}

Util.menuButton = function(name, content) {

	return $('<a id="' + name + '" class="menuButton" onclick="Util.' + name + '()">' + content + '</a>');
}         

Util.blockButton = function(blockTypeIndex) {

	return $('<a id="' + blockTypeIndex + '" class="blockButton" style="background-color: #' + CONFIG.BLOCK_TYPES[blockTypeIndex].color.toString(16) + '">&nbsp;</a>');
}         

Util.exit = function() {
	
	window.location.href = "index.php";
}

Util.save = function() {

	// TODO: Save edited level
}

Util.clear = function() {

	$('#display').html('');
}
 
Util.getBallPosition = function(trackPosition) {
	     
	var pos = ball.touchPoint();
	var result = new THREE.Vector3( 
		pos.x - Math.round(trackPosition.x*1000)/1000,
		pos.y - Math.round(trackPosition.y*1000)/1000,
		pos.z - Math.round(trackPosition.z*1000)/1000
	);                   
	// console.log("getBallPosition: " + pos.x + " - " + result.x);
	return result;                                                    
}  

Util.getCollisions = function(block, nextPos) {
	    
	var types = [];                              
	var ballPos = Util.getBallPosition(nextPos);                                              
	var movesLeft = (speedX > 0);
	var movesRight = (speedX < 0);
	var movesForward = (speedZ > 0);
	var movesBack = (speedZ < 0);
	var withinWidth = (ballPos.x > block.left) && (ballPos.x < block.right);
	var withinHeight = (ballPos.z > block.front) && (ballPos.z < block.back);
	var frontLeftIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var frontRightIntersection = (Math.pow(ballPos.z-block.front, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
	var backLeftIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.left, 2) < Math.pow(ball.geometry.radius, 2));
	var backRightIntersection = (Math.pow(ballPos.z-block.back, 2) + Math.pow(ballPos.x-block.right, 2) < Math.pow(ball.geometry.radius, 2));
	var frontIntersection = ((Math.abs(ballPos.z-block.front) < ball.geometry.radius) && withinWidth);
	var backIntersection = ((Math.abs(ballPos.z-block.back) < ball.geometry.radius) && withinWidth);
	var leftIntersection = ((Math.abs(ballPos.x-block.left) < ball.geometry.radius) && withinHeight);
	var rightIntersection = ((Math.abs(ballPos.x-block.right) < ball.geometry.radius) && withinHeight); 
	if (backRightIntersection) {
                   
		types.push("frontLeft");                                      
		console.log ("hit frontLeft");
	}
	else if (backLeftIntersection) {

		types.push("frontRight");
		console.log ("hit frontRight");
	}
	else if (frontRightIntersection) {

		types.push("backLeft");
		console.log ("hit backLeft");
	}
	else if (frontLeftIntersection) {

		types.push("backRight");
		console.log ("hit backRight");
	}        
	
	if (leftIntersection) {

		types.push("right");
		console.log ("hit right");
	}
	else if (rightIntersection) {

		types.push("left");
		console.log ("hit left");
	}
	else if (frontIntersection) {
                      
		types.push("back");
		console.log ("hit back");
	}
	else if (backIntersection) {
                                                      
		types.push("front");
		console.log ("hit front");
	}      
	
	return types;
}