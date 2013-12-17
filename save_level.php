<?php
/**
 * This script is called to save a level from level editor
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.level.php");
session_start();

if (isset($_POST["title"]) && isset($_POST["data"])) {

	$level = new Level($_POST["id"]);
	$result = $level->save($_POST["title"], $_POST["data"], $_SESSION["user_id"]);
	echo $result;
}

?>