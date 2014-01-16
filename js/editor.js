/**
 * The editor, allows to edit tracks and save them
 * as strings to the database.
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 * @constructor
 */

function Editor(levelId) {
                             						             
	this.maxRow = CONFIG.EDITOR.ROWS;
	this.activeButton;
	this.controlsContainer = $('#controls');
	this.displayContainer = $('#display');
	for (var i = 0; i < CONFIG.BLOCK_TYPES.length; i++) {
		
		if (CONFIG.BLOCK_TYPES[i].editor) {
			
			this.controlsContainer.append(Util.blockButton(CONFIG.BLOCK_TYPES[i]));
		}
	}
	if (levelId > 0) {
	
		Util.loadLevel(levelId);
	}
	else {
	
		this.clear();
		this.blockHeight = $("#tableCell_0_0").outerHeight();
		$("#buttonUp").css({
			
			display: "block"
		});
	}
	this.controlsContainer.append(Util.menuButton("editorLevelSelection", "LEVELS"));
	this.controlsContainer.append(Util.menuButton("editorSave", "SAVE"));
	this.controlsContainer.append(Util.menuButton("editorClear", "CLEAR"));
	this.controlsContainer.append(Util.menuButton("exit", "EXIT"));
	this.borderWidth = (this.displayContainer.outerWidth()-this.displayContainer.innerWidth())/2;
		                                                           
	this.blockButton = $('.blockButton').first();
}

/**
 * Clears the map
 */

Editor.prototype.clear = function() {
	
	this.topPos = 0;
	this.blocks = [];
	this.maxRow = CONFIG.EDITOR.ROWS;
	this.displayContainer.html("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	for (var i = this.maxRow-1; i >= 0; i--) {
	
		var tableRow = this.getEmptyTableRow(i);
		if (i == this.maxRow-1) {
			
			this.table.append(tableRow);
		}
		else {
			
			$('#editorTable tr:first').before(tableRow);
		}
		this.blocks.unshift([]);
		this.table.css({
			marginBottom: 0
		})
	}
	this.initHandlers();
};

/**
 * Adds all event handlers for the editor
 */

Editor.prototype.initHandlers = function() {
	
	$('#buttonUp, #buttonDown, #editorDisplayWrapper *').unbind();
	
	$('#levelSelection ul li a').click(function(e) {
		
		$('#levelSelection ul li span').css({
			
			display: "none"
		})
		$('#levelSelection ul li a').removeClass("active");
		$(e.target).addClass("active");
		var parent = $(e.target).parent()[0];
		if (parent.nodeName == "LI") {
			
			$(parent).children("span").css({
				
				display: "block"
			})
		}
	})
	
	$('#editorDisplayWrapper td').mousedown(function(e) {
        
		editor.addBlock(e.target.id);
		editor.mouseDown = true;
		return false;
	});
	
	$('#editorDisplayWrapper td').mouseup(function(e) {
        
		editor.mouseDown = false;
		return false;
	});
	
	$('#editorDisplayWrapper td').mousemove(function(e) {
        
		if (editor.mouseDown) {
			
			editor.addBlock(e.target.id);
		}
		return false;
	});
	
	$('#buttonUp').click(function(e) {
		
		editor.scrollUp();
	});
	
	$('#buttonDown').click(function(e) {
		
		editor.scrollDown();
	});
	
	$('#buttonUp, #buttonDown').mouseenter(function(e) {
		                
		$(e.target).css({ opacity: 1 });
	});
	
	$('#buttonUp, #buttonDown').mouseleave(function(e) {
		                
		$(e.target).css({ opacity: 0 });
	});
};

/**
 * Returns an empty table row string
 * @private
 * @param {Number} rowId Row number
 * @returns String for a table row
 * @type String
 */

Editor.prototype.getEmptyTableRow = function(rowId) {
	
	return "<tr>"
		+ "<td id=\"tableCell_" + rowId + "_0\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_1\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_2\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_3\"></td>"
		+ "<td id=\"tableCell_" + rowId + "_4\"></td>"
		+ "</tr>";
};

/**
 * Handles the scroll down button/overlay click
 */

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
};

/**
 * Handles the scroll up button/overlay click
 */

Editor.prototype.scrollUp = function() {
	
	var tableOffset = parseInt(this.table.css("margin-top"), 10);
	$("#buttonDown").css({
		
		display: "block"
	});
	var nextPos = tableOffset + this.blockHeight;
	if (nextPos > 0) {
		
		$('#editorTable tr:first').before(this.getEmptyTableRow(this.maxRow));
		this.blocks.push([]);
		this.maxRow++;
		this.initHandlers();
		this.topPos -= this.blockHeight;
	}
	else {
		
		this.table.css({
		
			marginTop: nextPos
		});
	}
};

/**
 * Loads a level
 * @param {Object} data Object with properties { title: Name of the level, data: ASCII string of level }
 */

Editor.prototype.loadLevel = function(data) {
	   
	this.blocks = [];
	var rows = 0;
	this.displayContainer.html("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	if (data && data.title && data.data) {
	
		$("#levelTitle").val(data.title);
		var levelData = data.data.split("\n");
		for (var row = levelData.length-2; row >= 0; row--) {
			
			var blockRow = [];
			var rowData = levelData[row];
			if (row == levelData.length-2) {
				
				this.table.append("<tr></tr>");
			}
			else {
				
				$('#editorTable tr:first').before("<tr></tr>");
			}			
			var rowObj = $("#editorTable tr").first();
			for (var col = 0; col < 5; col++) {
				
				var pos = [this.blocks.length, col];
				var type = rowData.charAt(col);
				var blockType = CONFIG.BLOCK_TYPES[parseInt(type, 10)];
				if (blockType 
					&& blockType.alternatingId
					&& ((pos[0]%2 == 1 && pos[1]%2 == 0) || (pos[0]%2 == 0 && pos[1]%2 == 1))
					) {
			
					type = "" + blockType.alternatingId;
				}
				if (blockType 
					&& blockType.defaultId
					&& ((pos[0]%2 == 1 && pos[1]%2 == 1) || (pos[0]%2 == 0 && pos[1]%2 == 0))
					) {
			
					type = "" + blockType.defaultId;
				}
				
				var id = "tableCell_" + pos[0] + "_" + pos[1];
				rowObj.append("<td id=\"" + id + "\"></td>");
				var colObj = $("#" + id);
				colObj.attr("class", type);
				if (type && type != " ") {
					
					colObj.css("backgroundColor", Util.getHexColorFromInt(CONFIG.BLOCK_TYPES[type].color));  
					blockRow.push(type);
				}
				else {
				
					blockRow.push(" ");
				}
			}
			this.blocks.unshift(blockRow);
		}
		if (levelData.length-1 < this.maxRow) {
			
			this.maxRow = levelData.length-1;
			while (this.maxRow < CONFIG.EDITOR.ROWS) {
				
				var tableRow = this.getEmptyTableRow(this.maxRow);
				if (row == 0) {
			
					this.table.append(tableRow);
				}
				else {
			
					$('#editorTable tr:first').before(tableRow);
				}
				this.blocks.unshift([]);
				this.maxRow++;
			}
		}
		this.blockHeight = $("#tableCell_0_0").outerHeight();
		this.maxRow = this.blocks.length;
		this.topPos = -1*this.blockHeight*(this.blocks.length-10);
		this.table.css({
			
			marginTop: this.topPos
		});
		this.initHandlers();
	}
	else {
		
		this.clear();
	}
	$("#buttonUp").css({
		
		display: "block"
	});
};

/**
 * Adds a block
 * @private
 * @param {Array} pos Array with the position of the block [rowId, columnId]
 */

Editor.prototype.addBlock = function(pos) {
	                        
	if (this.activeButton && !isNaN(parseInt(this.activeButton.attr("id"), 10))) {
		
		var block = $("#"+pos);
		pos = pos.replace("tableCell_", "").split("_");
		pos[0] = (this.maxRow-1)-pos[0];
		if (!this.blocks[pos[0]]) {
		
			this.blocks[pos[0]] = new Array();
		}
		var buttonId = parseInt(this.activeButton.attr("id"), 10);
		var blockType = CONFIG.BLOCK_TYPES[buttonId];
		if (blockType.alternatingId
			&& (
				(pos[0]%2 == 1 && pos[1]%2 == 1 && this.maxRow%2 == 0) || 
				(pos[0]%2 == 0 && pos[1]%2 == 0 && this.maxRow%2 == 0) ||
				(pos[0]%2 == 1 && pos[1]%2 == 0 && this.maxRow%2 == 1) || 
				(pos[0]%2 == 0 && pos[1]%2 == 1 && this.maxRow%2 == 1)
			)) {
			
			blockType = CONFIG.BLOCK_TYPES[blockType.alternatingId];
		}
		var buttonId = blockType.id;
		if (blockType.name == "empty") {
			
			buttonId = " ";
		}

		this.blocks[pos[0]][pos[1]] = "" + buttonId;
		var color = Util.getHexColorFromInt(blockType.color);
		block.attr("class", this.activeButton.attr("id"));
		block.css("backgroundColor", color);
	}
};

/**
 * Returns the current level ASCII string
 * @private
 * @returns Level data as ASCII string
 * @type String
 */

Editor.prototype.levelString = function() {
	
	var level = "";
	var rowString = "";
	for (var row = 0; row < this.blocks.length; row++) {
	
		for (var col = CONFIG.TRACK_WIDTH-1; col >= 0; col--) {
			
			var block = $("#tableCell_" + row + "_" + col);
			if (block && block.attr("class")) {
				
				rowString = block.attr("class") + rowString;
			}
			else {
				
				rowString = " " + rowString;
			}
		}
		if (rowString.trim() != "") {
		
			level = rowString + "\n" + level;
			rowString = "";
		}
		else if (level != "") {
			
			rowString = "\n" + rowString;
		}
	}
	return level;
};

