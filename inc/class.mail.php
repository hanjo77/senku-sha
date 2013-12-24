<?php
/**
 * Class Mail - Sends a simple HTML e-mail
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

require_once('PHPMailer/class.phpmailer.php');
require_once('class.config.php');

/**
 * Class Mail - Sends a simple HTML e-mail
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
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
		$phpmailer->Host = SenkuShaConfig::$mail["server"];
		$phpmailer->SMTPAuth = true;
		$phpmailer->Port  = 465;
		$phpmailer->Username = SenkuShaConfig::$mail["user"];
		$phpmailer->Password = SenkuShaConfig::$mail["password"];
		
		$phpmailer->SetFrom(SenkuShaConfig::$mail["address"], 'Senku-Sha'); //set from name

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