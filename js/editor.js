var editor = null;

function Editor() {
                                         
	this.activeButton = null;
	this.blocks = new Array();
	this.controlsContainer = $('#controls');
	this.displayContainer = $('#display');
	for (var i = 0; i < CONFIG.BLOCK_TYPES.length; i++) {
		
		this.controlsContainer.append(Util.blockButton(i));
	}
	this.controlsContainer.append(Util.menuButton("save", "SAVE"));
	this.controlsContainer.append(Util.menuButton("clear", "CLEAR"));
	this.controlsContainer.append(Util.menuButton("exit", "EXIT"));
	this.borderWidth = (this.displayContainer.outerWidth()-this.displayContainer.innerWidth())/2;
		                                                           
	this.blockButton = $('.blockButton').first();
	this.updateOffset();
}

Editor.prototype.updateOffset = function() {
	
	this.displayOffset = this.displayContainer.position();    
	if (this.displayOffset) {
		
		$("#buttonUp").css({

			top: this.displayOffset.top+this.borderWidth,
			left: this.displayOffset.left+this.borderWidth,
			width: this.displayContainer.innerWidth()
		});

		$("#buttonDown").css({

			top: (this.displayOffset.top-$("#buttonDown").outerHeight())+this.displayContainer.innerHeight()+this.borderWidth,
			left: this.displayOffset.left+this.borderWidth,
			width: this.displayContainer.innerWidth()
		});
	}
}

Editor.prototype.drawBlocks = function() {
	   
	this.displayContainer.html(""); 
	for (var row = 0; row < this.blocks.length; row++) {
		
		if (this.blocks[row]) {
			
			for (var col = 0; col < this.blocks[row].length; col++) {
				
				if (this.blocks[row][col]) {
					
					var color = CONFIG.BLOCK_TYPES[this.blocks[row][col]].color;
					if (color) {
					                                                              
						this.appendBlock([col, row], '#'+color.toString(16))
					} 
				}
			}
		}
	}
}

Editor.prototype.addBlock = function(pos) {
	                         
	if (this.blocks[pos[1]] && this.blocks[pos[1]][pos[0]]) {
		    
		this.removeBlock(pos);
	}
	if (!this.blocks[pos[1]]) {
		
		this.blocks[pos[1]] = new Array();
	}
	this.blocks[pos[1]][pos[0]] = this.activeButton.attr("id");
	var color = this.activeButton.css("backgroundColor");
	this.appendBlock(pos, color);                                                          
}

Editor.prototype.appendBlock = function(pos, color) {
	
	var id = "block_" + pos[0] + "_" + pos[1];
    this.displayContainer.append('<div class="block" id="' + id + '">&nbsp;</div>');
	$('#' + id).css({
		backgroundColor: color,
		height: this.blockButton.innerHeight() + "px",
		width: this.blockButton.innerWidth() + "px",
		left: this.displayOffset.left + this.borderWidth + (pos[0] * this.blockButton.innerWidth()) + "px",
		top: this.displayOffset.top + this.borderWidth + (pos[1] * this.blockButton.innerHeight()) + "px"
	});
}

Editor.prototype.removeBlock = function(pos) {
                      
	$("#block_" + pos[0] + "_" + pos[1]).remove();
    this.blocks[pos[1]][pos[0]] = null;            
}


