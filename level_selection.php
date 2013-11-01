<div id="levelSelection">
<h3>Choose<br />your level:</h3>
<ul>
<?

	require_once("inc/level.php");

	$level = new Level($_POST["id"]);
	$result = $level->list_levels($_SESSION["user_id"]);
	while($record = mysql_fetch_array($result)) {

		echo "<li>".
			"<a href=\"#editor_".$record["id"]."\" onclick=\"Util.loadLevel(".$record["id"].")\">".$record["title"]."</a>".
			"</li>";
	}

?>
</ul>
</div>