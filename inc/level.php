<?

require_once("inc/db_util.php");

class Level { 
	
	protected $self = array(); 
	
	private static $id;
	
	public function __construct($levelId) { 
		
		$this->id = 0;
		if (!is_null($levelId) && $levelId != "" && $levelId > 0) {
			
			$this->id = $levelId;
		}
    }
	
	function list_levels($user_id) {
	
		$db_util = new DBUtil();
		if (isset($user_id)) {
		
			$query = "SELECT * FROM `level` WHERE `creator` = ".$user_id." ORDER BY `title` ASC";
		}
		else {
		
			$query = "SELECT * FROM `level` ORDER BY `title` ASC";
		}
		return $db_util->query($query);	
	}

	function save($title, $data, $user_id) {
		   
		$db_util = new DBUtil();
		if (!isset($this->id) || $this->id == 0) {
			
			$query = "INSERT INTO `level` (`title`, `data`, `creator`) VALUES ('".$title."', '".$data."', '".$user_id."')";
			$id = $db_util->insert($query);
		}
		else {
			
			$query = "UPDATE `level` SET `title` = '".$title."', `data` = '".$data."' WHERE id = '".$this->id."'";
			$db_util->query($query);
			$id = $this->id;
		}
		return $id;	
	}
	
	function delete() {
		   
		$db_util = new DBUtil();
		if (!isset($this->id) || $this->id == 0) {
			
			$query = "DELETE FROM `level` WHERE `id` = '".$this->id."'";
			$result = $db_util->query($query);
			return $result;	
		}
		return null;
	}
	
	function activate() {
		   
		$db_util = new DBUtil();
		$query = "UPDATE `level` SET `active` = 1 WHERE `id` = '".$this->id."'";
		$result = $db_util->query($query);
		return $result;	
	}
	
	function deActivate() {
		   
		$db_util = new DBUtil();
		$query = "UPDATE `level` SET `active` = 0 WHERE `id` = '".$this->id."'";
		$result = $db_util->query($query);
		return $result;	
	}
	
	function load_plain($id) {
	
		$data = "{\n";
		$db_util = new DBUtil();
		$query = "SELECT `title`, `data` FROM `level` WHERE `id` = ".$id;
		$result = $db_util->query($query);
		while($record = mysql_fetch_array($result)) {
 		
			$data .= "\"data\": \"".str_replace("\n", "\\n", $record["data"])."\",\n"
			."\"title\": \"".$record["title"]."\"\n";
		}
		$data .= "}";
		return $data;
	}

	function load($id, $test) {
		  
		$this->id = $id; 
		$data = "";
		$goal_area = "01010\n"
				."10101\n"
				."01010\n"
				."10101\n"
				."01010\n"
				."10101\n"
				."01010\n"
				."10101\n"
				."01010\n";
		$counter = 0;
		$db_util = new DBUtil();
		$only_active = " AND `active` = 1";
		$limit = 2;
		if ($test) {
			
			$only_active = "";
			$limit = 1;
		} 
		$query = "SELECT `id`, `data` FROM `level` WHERE `id` >= ".$id.$only_active." ORDER BY `id` ASC LIMIT 0, ".$limit;
		$result = $db_util->query($query);
		$next_level = 0;
		$current_level = $id;
		while($record = mysql_fetch_array($result)) {
 		
			$data = $record["data"].$goal_area.$data;
			$next_level = $record["id"];
			if ($next_level == 0) {
				
				$current_level = $record["id"];
			}
			$counter++;
		}
		if ($counter < 2) {
			
			$data = $goal_area.$data;
			$next_level = "null";
		}
		return "{\n"
			."\"currentLevel\": ".$current_level.",\n"
			."\"nextLevel\": ".$next_level.",\n"
			."\"levelData\": \"".str_replace("\n", "\\n", $data)."\"\n"
			."}";	
	}
}

?>