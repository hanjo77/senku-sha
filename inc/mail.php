<?

require_once('inc/PHPMailer/class.phpmailer.php');

/**
 * Class Mail
 */
class Mail { 
	
	protected $self = array();
	
	private static $table; 
	private static $fields = array();

    /**
     * Initializes a new Mail object
     */
    public function __construct() {
                             
    }

    /**
     * Sends a HTML message by e-mail
     * @param string $to_addr Destination address
     * @param string $to_name Destination name
     * @param string $subject Subject
     * @param string $message Message HTML string
     * @return string Response (OK | error info)
     */
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