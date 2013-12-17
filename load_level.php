<?php
/**
 * Loads a level from database to be used in game
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$test = false;
	if (isset($_POST["test"])) {
		
		$test = $_POST["test"];
	}
	$result = $level->load($_POST["id"], $test);
	echo $result;
}

?>