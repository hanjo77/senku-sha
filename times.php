<?php
/**
 * Displays the best level times
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><h2>Best times</h2>
<ul class="bestTimes">
<?   
  	
require_once("inc/class.db_util.php");

$db_util = new DBUtil();
$query = "SELECT DISTINCT `user`.`name` AS `user`, `level`.`title` AS `level`, `time`"
	."FROM `time`"
	."JOIN `user` on `time`.`user` = `user`.`id`"
	."JOIN `level` on `time`.`level` = `level`.`id`"
	."WHERE `time`= (SELECT MIN(time) FROM `time` WHERE `level` = `level`.`id` LIMIT 0, 1)"
	."ORDER BY `level`.`id`";
$result = $db_util->query($query);

while($record = mysql_fetch_array($result)) {

	echo("<li>"
		."<h3>".htmlentities($record["level"])."</h3>"
		."<p>".htmlentities($record["user"])."<span class=\"bestLevelTime\">".$record["time"]." Sec</span></p>"
		."</li>");
}

?> 
</ul>
<input type="button" class="button" name="exit" id="btnCancel" value="Back" />