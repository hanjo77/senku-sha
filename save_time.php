<?php
/**
 * This script is called to save the level time
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.db_util.php");
session_start();

if (isset($_POST["time"]) && isset($_POST["level"]) && isset($_SESSION) && isset($_SESSION["user_id"])) {

	$db_util = new DBUtil();
	$query = "INSERT INTO `time` (`user`, `level`, `time`) VALUES ('".$_SESSION["user_id"]."', '".$_POST["level"]."', '".$_POST["time"]."')";
	$id = $db_util->insert($query);
}

?>