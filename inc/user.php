<?

require_once("inc/db_util.php");

class User { 
	
	protected $self = array(); 
	
	public function __construct() { 
		
    }

	function login() {
		   
		$return = null; 
		$db_util = new DBUtil();
		$query = "SELECT `id` FROM `user` WHERE (`name` = '".$_POST['name']."' OR `email` = '".$_POST['name']."') AND `password` = PASSWORD('".$_POST['password']."') AND `active` = 1";
		$result = $db_util->query($query);
		if ($row = mysql_fetch_assoc($result)) {
			
			$return = $row['id'];
		}
		return $return;	
	}

	function activate() {
		
		if (isset($_GET["id"]) && $_GET["id"] != "" && $_GET["h"] == $this->hash($_GET["id"])) {
		
			$db_util = new DBUtil();
			$query = "UPDATE `user` SET `active` = '1' WHERE id = '".$_GET["id"]."'";
			$result = $db_util->query($query);
			return true;
		}
		return false;	
	}
	
	function hash($id) {
	
		return md5("$3cur1tY-".$id."-(h3(k");
	}
}

?>