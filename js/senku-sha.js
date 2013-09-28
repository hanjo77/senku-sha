importScript("config.js");
importScript("ball.js");
importScript("block.js");
importScript("track.js");
importScript("game.js"); 
importScript("util.js"); 

function importScript(url) {

	document.write('<scr' + 'ipt src="js/' + url + '"></script>');
}