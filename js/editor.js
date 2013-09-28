$(document).ready(function() {

	editor = new Editor();
	$('#controls a').click(function(e) {

		var obj = $(e.target);
		$('#controls a').removeClass("active");
		if (!obj.hasClass("active")) {
		                        
			editor.activeButton = obj;
			obj.addClass("active");
		}                          
	});
	
	editor.displayContainer.click(function(e) {
                  
		var pos = [
			Math.floor((e.clientX - editor.displayOffset.left) / editor.blockButton.innerWidth()), 
			Math.floor((e.clientY - editor.displayOffset.top) / editor.blockButton.innerHeight())
		];
		editor.addBlock(pos);
	});
});

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
	                                                           
	this.blockButton = $('.blockButton').first();
	this.displayOffset = this.displayContainer.offset();
}

Editor.prototype.addBlock = function(pos) {
	                         
	if (this.blocks[pos[1]] && this.blocks[pos[1]][pos[0]]) {
		    
		this.removeBlock(pos);
	}
	if (!this.blocks[pos[1]]) {
		
		this.blocks[pos[1]] = new Array();
	}
	this.blocks[pos[1]][pos[0]] = this.activeButton.attr("id");                                                          
	var id = "block_" + pos[0] + "_" + pos[1];
	var borderWidth = (this.displayContainer.outerWidth()-this.displayContainer.innerWidth())/2;
    this.displayContainer.append('<div class="block" id="' + id + '">&nbsp;</div>');
	$('#' + id).css({
		backgroundColor: this.activeButton.css("backgroundColor"),
		height: this.blockButton.innerHeight() + "px",
		width: this.blockButton.innerWidth() + "px",
		left: this.displayOffset.left + borderWidth + (pos[0] * this.blockButton.innerWidth()) + "px",
		top: this.displayOffset.top + borderWidth + (pos[1] * this.blockButton.innerHeight()) + "px"
	});
}

Editor.prototype.removeBlock = function(pos) {
                      
	$("#block_" + pos[0] + "_" + pos[1]).remove();
    this.blocks[pos[1]][pos[0]] = null;            
}


