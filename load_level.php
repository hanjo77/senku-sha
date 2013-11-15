<?

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