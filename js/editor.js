
function Editor(levelId) {
                             						             
	this.activeButton;
	this.topPos = 0;
	this.maxRow = 11;
	this.blocks = new Array();
	this.controlsContainer = $('#controls');
	this.displayContainer = $('#display');
	this.displayContainer.append("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	for (var i = 0; i < CONFIG.BLOCK_TYPES.length; i++) {
		
		if (CONFIG.BLOCK_TYPES[i].editor) {
			
			this.controlsContainer.append(Util.blockButton(CONFIG.BLOCK_TYPES[i]));
		}
	}
	if (levelId > 0) {
	
		Util.loadLevel(levelId);
	}
	else {
	
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
		this.blockHeight = $("#tableCell_0_0").outerHeight();
		$("#buttonUp").css({
			
			display: "block"
		});
	}
	this.controlsContainer.append(Util.menuButton("editorLoad", "LOAD"));
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
		this.blocks.push([]);
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

Editor.prototype.loadLevel = function(data) {
	   
	this.blocks = [];
	var rows = 0;
	this.displayContainer.html("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	if (data && data.title && data.data) {
	
		$("#levelTitle").val(data.title);
		var levelData = data.data.split("\n");
		for (var row = 0; row < levelData.length; row++) {
			
			var blockRow = [];
			var rowData = levelData[row];
			if (rowData.trim() != "") {
			
				this.table.append("<tr></tr>");
				var rowObj = $("#editorTable tr").last();
				for (var col = 0; col < 5; col++) {
					
					var type = rowData.charAt(col);
					var id = "tableCell_" + this.blocks.length + "_" + col;
					rowObj.append("<td id=\"" + id + "\"></td>");
					var colObj = $("#" + id);
					if (type && type != " ") {
						
						blockRow.push(type);
						colObj.attr("class", type);
						colObj.css("backgroundColor", Util.getHexColorFromInt(CONFIG.BLOCK_TYPES[type].color));  
					}
					else {
					
						blockRow.push(" ");
					}
				}
				this.blocks.push(blockRow);
			}
		}
		this.blockHeight = $("#tableCell_0_0").outerHeight();
		this.maxRow = this.blocks.length;
		this.topPos = -1*this.blockHeight*(this.blocks.length-10);
		this.table.css({
			
			marginTop: this.topPos
		});
	}
	$("#buttonUp").css({
		
		display: "block"
	});
}

Editor.prototype.addBlock = function(pos) {
	                        
	if (!isNaN(parseInt(this.activeButton.attr("id"), 10))) {
		
		var block = $("#"+pos);
		pos = pos.replace("tableCell_", "").split("_");
		if (!this.blocks[pos[0]]) {
		
			this.blocks[pos[0]] = new Array();
		}
		var buttonId = parseInt(this.activeButton.attr("id"), 10);
		var blockType = CONFIG.BLOCK_TYPES[buttonId];
		if (blockType.name == "empty") {
			
			buttonId = " ";
		}
		else if (blockType.alternatingId
			&& (
				(pos[0]%2 == 1 && pos[1]%2 == 1)
				|| (pos[0]%2 == 0 && pos[1]%2 == 0)				
			)) {
			
			blockType = CONFIG.BLOCK_TYPES[blockType.alternatingId];
		}
		this.blocks[pos[0]][pos[1]] = blockType.id;
		var color = Util.getHexColorFromInt(blockType.color);
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
				else if (level != "") {
					
					level += " ";
				}
			}
		}
		if (level != "") {
		
			level += "\n";
		}
	}
	while (level.charAt(level.length-2) == '\n') {
	
		level = level.substring(0, level.length-1);
	}
	return level;
}

