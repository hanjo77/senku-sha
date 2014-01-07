<?php

require_once("class.config.php");

/**
 * Class DBUtil - Database utility
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

/**
 * Class DBUtil - Database utility
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

class DBUtil {
	
	protected $self = array();
	private static $url;
	private static $db;
	private static $user;
	private static $password;
	private static $connection;

    /**
     * Initializes a new DBUtil class
     */
    public function __construct() {
		$this->url = SenkuShaConfig::$db["server"];
		$this->db = SenkuShaConfig::$db["name"];
		$this->user = SenkuShaConfig::$db["user"];
		$this->password = SenkuShaConfig::$db["password"];
    }

    /**
     * Connects to the database
     */
    function connect() {
		
		$this->connection = mysql_connect($this->url, $this->user, $this->password);
		if(! $this->connection )
		{
		  die('Could not connect: ' . mysql_error());
		}
		mysql_select_db($this->db);
	}

    /**
     * Executes a query on the database
     * @param string $query SQL-query
     * @return resource Database response object
     */
	function query($query) {
	       
	  	$this->connect();
		$result = mysql_query(preg_replace("/\[\[\[([^\]\]\]]*)\]\]\]/", mysql_real_escape_string("$1"), $query), $this->connection);
		if (!$result) {
			
			echo mysql_error();
		}
		mysql_close();
		return $result;	
	}

    /**
     * Inserts into database
     * @param string $query SQL-query
     * @return int ID
     */
    function insert($query) {
	       
	  	$this->connect();
		mysql_query(preg_replace("/\[\[\[([^\]\]\]]*)\]\]\]/", mysql_real_escape_string("$1"), $query));
		$id = mysql_insert_id();
		mysql_close();
		return $id;	
	}
}

?>