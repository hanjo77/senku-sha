
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

Editor.prototype.clear = function() {
	
	this.topPos = 0;
	this.blocks = [];
	this.maxRow = CONFIG.EDITOR.ROWS;
	this.displayContainer.html("<table id=\"editorTable\"></table>");
	this.table = $("#editorTable");
	for (var i = 0; i < this.maxRow; i++) {
	
		var tableRow = this.getEmptyTableRow(i);
		if (i == 0) {
			
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
}

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
			if (row == 0) {
				
				this.table.append("<tr></tr>");
			}
			else {
				
				$('#editorTable tr:first').before("<tr></tr>");
			}			
			var rowObj = $("#editorTable tr").first();
			for (var col = 0; col < 5; col++) {
				
				var type = rowData.charAt(col);
				var id = "tableCell_" + this.blocks.length + "_" + col;
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
			this.blocks.push(blockRow);
		}
		if (levelData.length < this.maxRow) {
			
			this.maxRow = levelData.length;
			while (this.maxRow < CONFIG.EDITOR.ROWS) {
				
				var tableRow = this.getEmptyTableRow(this.maxRow);
				if (row == 0) {
			
					this.table.append(tableRow);
				}
				else {
			
					$('#editorTable tr:first').before(tableRow);
				}
				this.blocks.push([]);
				this.maxRow++
			}
		}
		this.blockHeight = $("#tableCell_0_0").outerHeight();
		this.maxRow = this.blocks.length;
		this.oddRows = (this.maxRow%2 == 1);
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
}

Editor.prototype.addBlock = function(pos) {
	                        
	if (this.activeButton && !isNaN(parseInt(this.activeButton.attr("id"), 10))) {
		
		var block = $("#"+pos);
		pos = pos.replace("tableCell_", "").split("_");
		if (!this.blocks[pos[0]]) {
		
			this.blocks[pos[0]] = new Array();
		}
		var buttonId = parseInt(this.activeButton.attr("id"), 10);
		var blockType = CONFIG.BLOCK_TYPES[buttonId];
		if (blockType.alternatingId
			&& ((!this.oddRows && ((pos[0]%2 == 1 && pos[1]%2 == 1) || (pos[0]%2 == 0 && pos[1]%2 == 0)))
				|| (this.oddRows && ((pos[0]%2 == 1 && pos[1]%2 == 0) || (pos[0]%2 == 0 && pos[1]%2 == 1))))
			) {
			
			blockType = CONFIG.BLOCK_TYPES[blockType.alternatingId];
		}
		var buttonId = blockType.id;
		if (blockType.name == "empty") {
			
			buttonId = " ";
		}

		this.blocks[pos[0]][pos[1]] = buttonId;
		var color = Util.getHexColorFromInt(blockType.color);
		block.attr("class", this.activeButton.attr("id"));
		block.css("backgroundColor", color);   
	}
}

Editor.prototype.levelString = function() {
	
	var level = "";
	for (var row = 0; row < this.blocks.length; row++) {
	
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
		if (level.trim() != "") {
		
			level += "\n";
		}
	}
	while (level.charAt(level.length-2) == '\n') {
	
		level = level.substring(0, level.length-1);
	}
	return level;
}

