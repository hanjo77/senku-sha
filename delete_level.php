<?

require_once("inc/class.level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$result = $level->delete();
	echo $result;
}

?>