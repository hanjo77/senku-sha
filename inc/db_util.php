<?

class DBUtil { 
	
	protected $self = array();
	private static $url;
	private static $db;
	private static $user;
	private static $password;
	private static $connection;
	
	public function __construct() {
                             
		$this->url = "127.0.0.1"; 
		$this->db = "senku-sha";
		$this->user = "senku-sha";  
		$this->password = "53nku-5h4";
    }
          
	function connect() {
		
		$this->connection = mysql_connect($this->url, $this->user, $this->password);
		if(! $this->connection )
		{
		  die('Could not connect: ' . mysql_error());
		}
		mysql_select_db($this->db);
	}

	function query($query) {
	       
	  	$this->connect();
		$result = mysql_query($query, $this->connection);
		if (!$result) {
			
			echo mysql_error();
		}
		mysql_close();
		return $result;	
	}

	function insert($query) {
	       
	  	$this->connect();
		mysql_query($query);
		$id = mysql_insert_id();
		mysql_close();
		return $id;	
	}
}

?>