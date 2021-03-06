<?php
/**
 * Loads a level from the database to be used in level editor
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$level->deActivate();
	$result = $level->load_plain($_POST["id"]);
	echo $result;
}

?>