<?

require_once("inc/level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$result = $level->delete($_POST["id"]);
	echo $result;
}

?>