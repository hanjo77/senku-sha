<?php
/**
 * Class User - Handles various user operations
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once("inc/class.db_util.php");

/**
 * Class User - Handles various user operations
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
class User {
	
	protected $self = array();

    /**
     * Initializes a new User object
     */
    public function __construct() {
		
    }

    /**
     * Checks for valid credentials in the POST request object
     * @return null|int User ID
     */
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

    /**
     * Activates the user
     * @return bool True, if activation was successful, otherwise false
     */
    function activate() {
		
		if (isset($_GET["id"]) && $_GET["id"] != "" && $_GET["h"] == $this->hash($_GET["id"])) {
		
			$db_util = new DBUtil();
			$query = "UPDATE `user` SET `active` = '1' WHERE id = '".$_GET["id"]."'";
			$result = $db_util->query($query);
			return true;
		}
		return false;	
	}

    /**
     * Generates the hash for activation
     * @param int $id User ID
     * @return string Hash string
     */
    function hash($id) {
	
		return md5("$3cur1tY-".$id."-(h3(k");
	}
}

?>