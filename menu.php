<?php
/**
 * The content include for the main menu
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><?

if (!isset($_SESSION)) {
	
	session_start();
}

if (isset($_GET["logout"])) {

	unset($_SESSION["user_id"]);
}

?>
<h1>先駆者</h1>
<h2>Senku-Sha</h2>
<div class="buttonRows">
	<a rel="game.php" class="menuButton">Play</a> 
	<div class="buttonRow">
	<?
                              
	if (!isset($_SESSION["user_id"]) || $_SESSION["user_id"] <= 0) {

		?>
		<a rel="register.php" class="menuButton">Register</a>
		<a rel="login.php" class="menuButton">Login</a>
		<?

	}
	else { 

		?>
		<a rel="editor.php" class="menuButton">Editor</a>
		<a id="btnLogout" class="menuButton">Logout</a>
		<?

	}

	?>
	</div>
</div>
<div class="copyRight">&copy; Hanjo 2013</div>
