<?php
/**
 * The content include file for the actual game
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><script>
game = new Game(<?

	if (isset($_GET["id"])) {
		
		echo($_GET["id"]);
	}

?>);
</script>