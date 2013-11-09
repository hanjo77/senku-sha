<?

require_once("inc/level.php");
session_start();

if (isset($_POST["id"])) {

	$level = new Level($_POST["id"]);
	$level->deActivate();
	$result = $level->load_plain($_POST["id"]);
	echo $result;
}

?>