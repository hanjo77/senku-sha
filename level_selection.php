<?

session_start();         


?><div id="levelSelection">
<h3>Choose<br />your level:</h3>
<ul>
<?

	require_once("inc/level.php");

	$level = new Level(0);
	$result = $level->list_levels($_SESSION["user_id"]);
	while($record = mysql_fetch_array($result)) {

		$active = "";
		if ($record["active"] == 1) {
			
			$active = " (active)";
		}
		echo "<li id=\"level_".$record["id"]."\">".
				"<a href=\"#editor_".$record["id"]."\">".$record["title"].$active."</a>".
				"<span>".
					"<a class=\"buttonLoad\" onclick=\"Util.loadLevel(".$record["id"].")\">Load</a>".
					"<a class=\"buttonLoad\" onclick=\"Util.testLevel(".$record["id"].")\">Test</a>".
					"<a class=\"buttonDelete\" onclick=\"Util.deleteLevel(".$record["id"].")\">Delete</a>".
				"</span>".
			"</li>";
	}

?>
</ul>
</div>