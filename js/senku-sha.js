/**
 * The main class that imports all the required scripts
 * and starts the Senku-Sha application.
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

importScript("lib/leap.min.js");
importScript("lib/three.min.js");  
importScript("lib/jquery.min.js");
importScript("lib/obj_mtl_loader.js");
importScript("lib/mtl_loader.js");
importScript("config.js");
importScript("util.js");
importScript("validation.js");
importScript("editor.js");
importScript("ball.js");
importScript("bg_ball.js");
importScript("block.js");
importScript("track.js");
importScript("intro.js");
importScript("game.js");

/**
 * Imports a script file
 * @param {String} url Script path relative to the script root folder
 */

function importScript(url) {

	document.write('<scr' + 'ipt src="js/' + url + '"></script>');
}

/**
 * Checks if WebGL and Canvas are available.
 * Displays messages if not, otherwise handles the current URL hash if OK.
 */

window.onload = function() {
	
	var canvas = !! window.CanvasRenderingContext2D;
	var webgl = (
		
		function () { 
		
			try { 
			
				var canvas = document.createElement( 'canvas' );
				return !! window.WebGLRenderingContext 
					&& ( canvas.getContext( 'webgl' ) 
					|| canvas.getContext( 'experimental-webgl' )
				 );
			 } catch( e ) { 
			 
				 return false; 
			 } 
	 	}
	)();

	if (!webgl || !canvas) {
		
		$("#noWebGL").css({
			display: "table-cell"
		});
		$("#bgBall").css({
			display: "none"
		});
		$("#contentWrapper").css({
			display: "none"
		});
	}
	else {
		
		Util.handleHash();
	}
};

// Global variables

var mouseX, mouseY, bgBall, intro, game, editor;
