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

		$phpmailer->IsSMTP(); // telling the class to use SMTP
		$phpmailer->Host = "ssl://smtp.gmail.com"; // SMTP server
		$phpmailer->SMTPAuth = true;                  // enable SMTP authentication
		$phpmailer->Port  = 465;          // set the SMTP port for the GMAIL server; 465 for ssl and 587 for tls
		$phpmailer->Username = "senku.sha.game@gmail.com"; // Gmail account username
		$phpmailer->Password = "53nku-5h4";        // Gmail account password

		$phpmailer->SetFrom('senku-sha@hanjo.dyndns.info', 'Senku-Sha'); //set from name

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