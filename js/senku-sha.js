importScript("lib/three.min.js");  
importScript("lib/jquery.min.js");
importScript("lib/obj_mtl_loader.js");
importScript("lib/mtl_loader.js");
importScript("config.js");
importScript("util.js");
importScript("user.js");
importScript("validation.js");
importScript("editor.js");
importScript("ball.js");
importScript("bg_ball.js");
importScript("block.js");
importScript("track.js");
importScript("intro.js");

function importScript(url) {

	document.write('<scr' + 'ipt src="js/' + url + '"></script>');
}

window.onload = function() {
	
	Util.handleHash();
};