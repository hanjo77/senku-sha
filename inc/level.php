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
}

?>