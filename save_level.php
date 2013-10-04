<?

require_once("inc/level.php");
session_start();

if (isset($_POST["title"]) && isset($_POST["data"])) {

	$level = new Level($_POST["id"]);
	$result = $level->save($_POST["title"], $_POST["data"], $_SESSION["user_id"]);
	echo $result;
}

?>