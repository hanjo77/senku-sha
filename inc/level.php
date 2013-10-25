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

	function load($id) {
		  
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
		$query = "SELECT `id`, `data` FROM `level` WHERE `id` >= ".$id." ORDER BY `id` DESC LIMIT 0, 2";
		$result = $db_util->query($query);
		$next_level = 0;
		$current_level = $id;
		while($record = mysql_fetch_array($result)) {
 		
			$data .= $record["data"]
				.$goal_area;
			if ($next_level == 0) {
				
				$next_level = $record["id"];
			}
			$current_level = $record["id"];
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