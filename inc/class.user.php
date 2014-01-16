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
	private $id;

    /**
     * Initializes a new User object
	 * @param int $id User ID
     */
    public function __construct($id) {
		
		$this->id = $id;
    }

    /**
     * Checks for valid credentials in the POST request object
     * @return null|int User ID
     */
    function login() {
		   
		$this->id = null; 
		$db_util = new DBUtil();
		$query = "SELECT `id` FROM `user` WHERE (`name` = '[[[".$_POST['name']."]]]' OR `email` = '[[[".$_POST['name']."]]]') AND `password` = PASSWORD('[[[".$_POST['password']."]]]') AND `active` = 1";
        $result = $db_util->query($query);
		if ($row = mysql_fetch_assoc($result)) {
			
			$this->id = $row['id'];
		}
		return $this->id;	
	}

    /**
     * Activates the user
     * @return bool True, if activation was successful, otherwise false
     */
    function activate($hash) {
		
		if ($hash == $this->hash()) {
		
			$db_util = new DBUtil();
			$query = "UPDATE `user` SET `active` = '1' WHERE id = '".$this->id."'";
			$result = $db_util->query($query);
			return true;
		}
		return false;	
	}

    /**
     * Deletes the user
     * @return bool True, if activation was successful, otherwise false
     */
    function delete() {
		
		if ($this->id != null) {
		
			$db_util = new DBUtil();
			$query = "DELETE FROM `user` WHERE id = '".$this->id."'";
			$result = $db_util->query($query);
			return true;
		}
		return false;	
	}

    /**
     * Generates the hash for activation
     * @return string Hash string
     */
    function hash() {
	
		return md5("$3cur1tY-".$this->id."-(h3(k");
	}
}

?>