<?

require_once("inc/db_util.php");

class User { 
	
	protected $self = array(); 
	
	public function __construct() { 
		
    }

	function login() {
		   
		$return = null; 
		$db_util = new DBUtil();
		$query = "SELECT `id` FROM `user` WHERE (`name` = '".$_POST['name']."' OR `email` = '".$_POST['name']."') AND `password` = PASSWORD('".$_POST['password']."')";
		$result = $db_util->query($query);
		if ($row = mysql_fetch_assoc($result)) {
			
			$return = $row['id'];
		}
		return $return;	
	}
}

?>