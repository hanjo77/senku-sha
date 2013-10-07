<?

require_once("inc/db_util.php");

class Form { 
	
	protected $self = array();
	
	private static $table; 
	private static $fields = array(); 
	
	public function __construct($table, $fields) {
                             
    	$this->table = $table;
    	$this->fields = $fields;
    }

    function add_field($field) { 
	
		$name = array_keys($this->fields, $field);
		if (sizeof($name) > 0) {
			
			$name = $name[0];
			$type = $field["type"];
			$label = $field["label"];
			$id = $name."Input";
			$value = "";
			$class = "";
			$misc = "";
			if (isset($field["misc"])) {
			
				$misc = $field["misc"];
			}
			if (isset($field["validators"])) {
			                      
				foreach ($field["validators"] as $key=>$validator) {
				                    
					$class .= " ".$validator;
				}             
			}
			if ($type != "password") {
			
				if (isset($name) && isset($_POST[$name])) {

					$value = $_POST[$name];
				}
				else if (isset($field["value"])) {

					$value = $field["value"];
				}
			}
			include("templates/tmpl_input_text.php");
		}
    }

	function display() {
		
		include("templates/tmpl_form.php");	
	}

	function save() {
		    
		$fields = "";
		$values = ""; 
		foreach ($this->fields as $key=>$field) {

			if ($field["dbStore"]) {
				
				if ($fields != "") {
				
					$fields.= ", ";
					$values.= ", ";
				}
				$fields .= "`".$key."`";
				if ($field["type"] == "password") {
				
					$values .= "PASSWORD('".$_POST[$key]."')";
				}
				else {
				
					$values .= "'".$_POST[$key]."'";
				}
			}
		}
		$db_util = new DBUtil();
		$result = $db_util->query("INSERT INTO `".$this->table."` (".$fields.") VALUES (".$values.")");		
		return $result;	
	}
}

?>