<?php
/**
 * This script is called to delete a level
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$result = $level->delete();
	echo $result;
}

?>