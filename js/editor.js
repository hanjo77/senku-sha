
function Editor() {
                             						             
	this.activeButton;
	this.topPos = 0;
	this.maxRow = 10;
	this.blocks = new Array();
	this.controlsContainer = $('#controls');
	this.displayContainer = $('#display');
	this.displayContainer.append("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	for (var i = 2; i < CONFIG.BLOCK_TYPES.length; i++) {
		
		this.controlsContainer.append(Util.blockButton(i));
	}
	for (var i = 0; i < this.maxRow; i++) {
	
		var tableRow = this.getEmptyTableRow(i);
		if (i == 0) {
			
			this.table.append(tableRow);
			this.blocks.push([]);
		}
		else {
			
			$('#editorTable tr:first').before(tableRow);
			this.blocks.unshift([]);
		}
		this.table.css({
			marginBottom: 0
		})
	}
	this.blockHeight = $("#tableCell_0_0").height();
	this.controlsContainer.append(Util.menuButton("editorSave", "SAVE"));
	this.controlsContainer.append(Util.menuButton("editorClear", "CLEAR"));
	this.controlsContainer.append(Util.menuButton("exit", "EXIT"));
	this.borderWidth = (this.displayContainer.outerWidth()-this.displayContainer.innerWidth())/2;
		                                                           
	this.blockButton = $('.blockButton').first();
	Util.initEditorHandlers();
}

Editor.prototype.getEmptyTableRow = function(rowId) {
	
	return "<tr>"
		+ "<td id=\"tableCell_" + rowId + "_0\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_1\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_2\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_3\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_4\"></td>"
		+ "</tr>";
}

Editor.prototype.scrollDown = function() {
	
	var tableOffset = parseInt(this.table.css("margin-top"), 10);
	if (tableOffset > this.topPos) {
		
		this.table.css({
			
			marginTop: tableOffset - this.blockHeight
		});
	}
	else{
			
		$("#buttonDown").css({
			
			display: "none"
		});
	}
}

Editor.prototype.scrollUp = function() {
	
	var tableOffset = parseInt(this.table.css("margin-top"), 10);
	$("#buttonDown").css({
		
		display: "block"
	});
	var nextPos = tableOffset + this.blockHeight;
	if (this.topPos < nextPos) {
		
		$('#editorTable tr:first').before(this.getEmptyTableRow(this.maxRow));
		this.blocks.unshift([]);
		this.topPos -= this.blockHeight;
		this.maxRow++;
		Util.initEditorHandlers();
	}
	else if (nextPos >= this.topPos) {
		
		this.table.css({
		
			marginTop: nextPos
		});
	}
}

Editor.prototype.drawBlocks = function() {
	   
	// this.displayContainer.html(""); 
	for (var row = 0; row < this.blocks.length; row++) {
		
		if (this.blocks[row]) {
			
			for (var col = 0; col < this.blocks[row].length; col++) {
				
				if (this.blocks[row][col]) {
					
					var color = CONFIG.BLOCK_TYPES[this.blocks[row][col]].color;
					if (color) {
					                 
						color = color.toString(16);
						while (color.length < 6) {
							
							color = "0" + color;
						}                                             
						this.appendBlock([col, row], '#'+color)
					} 
				}
			}
		}
	}
}

Editor.prototype.addBlock = function(pos) {
	                        
	if (!isNaN(parseInt(this.activeButton.attr("id"), 10))) {
		
		var block = $("#"+pos);
		pos = pos.replace("tableCell_", "").split("_");
		if (!this.blocks[pos[0]]) {
		
			this.blocks[pos[0]] = new Array();
		}
		this.blocks[pos[0]][pos[1]] = this.activeButton.attr("id");
		var color = this.activeButton.css("backgroundColor");
		block.attr("class", this.activeButton.attr("id"));
		block.css("backgroundColor", color);                                                          
	}
}

Editor.prototype.levelString = function() {
	
	var level = "";
	for (var row = this.blocks.length-1; row >= 0; row--) {
		
		if (this.blocks[row]) {
			
			for (var col = 0; col < this.blocks[row].length; col++) {
				
				if (this.blocks[row][col]) {
					
					level += this.blocks[row][col];
				}
				else {
					
					level += " ";
				}
			}
		}
		level += "\n"
	}
	return level;
}

