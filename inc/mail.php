<?

require_once('inc/PHPMailer/class.phpmailer.php');

class Mail { 
	
	protected $self = array();
	
	private static $table; 
	private static $fields = array(); 
	
	public function __construct() {
                             
    }

    function send($to_addr, $to_name, $subject, $message) { 
	
		$phpmailer = new PHPMailer();

		$phpmailer->IsSMTP();
		$phpmailer->Host = "ssl://smtp.gmail.com";
		$phpmailer->SMTPAuth = true;
		$phpmailer->Port  = 465;
		$phpmailer->Username = "********";
		$phpmailer->Password = "********";
		
		$phpmailer->SetFrom('mymail@domain.com', 'Senku-Sha'); //set from name

		$phpmailer->Subject = $subject;
		$phpmailer->MsgHTML($message);

		$phpmailer->AddAddress($to_addr, $to_name);

		if(!$phpmailer->Send()) {
		
			return $phpmailer->ErrorInfo;
		}
		else {
		
			return "OK";
		}
	}
}

?>