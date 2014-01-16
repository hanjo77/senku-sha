<?php
/**
 * The content include for the registration form
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><h2>Registration</h2>

<?   
  	
require_once("inc/class.form.php");
require_once("inc/class.mail.php");
require_once("inc/class.user.php");

$form = new Form("user", array(
			  
       "name" => array(   

		'type' => 'text',
		'label' => 'Name',
		'dbStore' => true,
		'validators' => array(
		    'required'
			)
	    ),
       "email" => array( 

		'type' => 'text',
		'label' => 'E-Mail',
		'dbStore' => true,
		'validators' => array(
		    'required',
			'email'
			)
		),
       "password" => array( 

		'type' => 'password',
		'label' => 'Password',
		'dbStore' => true,
		'validators' => array(
		    'required',
			'password'
			)
		),
       "passwordRepeat" => array( 

		'type' => 'password',
		'label' => 'Repeat password',
		'dbStore' => false,
		'validators' => array(
		    'required',
			'passwordRepeat'
			),
		'misc' => ' data-rel="passwordInput"'   
		) 
	) 
);

if (isset($_POST["submit"])) {
	    
	$response = $form->save();
	$mail = new Mail();
	
	if ($response) {
	
		$user = new User($response);
		?>

		<p>Thanks for your registration!</p>
		
		<?
		
		$url = $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
		$url = substr($url, 0, strrpos($url, "/"));
		$subject = "Please register your account";
		$message = "<h2>Hello ".htmlentities($_POST["name"])."</h2>"
			."<p>Thank you very much for your registration.</p>"
			."<p>Please click the following link to activate your account:</p>"
			."<p><a href=\"http://".$url."/activate_user.php?id=".$response."&amp;h=".$user->hash($response)."\">Click to activate your account</a></p>"
			."<p>Cheers,<br />"
			."Hanjo</p>";
		
		$mail_response = $mail->send($_POST["email"], $_POST["name"], $subject, $message);

		if ($mail_response == "OK") {
		
		?>
		
		<p>You will receive a message by e-mail to activate your account in a moment.</p>

		<?
		}
		else {
			
			$user->delete();
		?>
		
		<p><?= $mail_response ?></p>
		
		<?
		}
	}
	else {
	  
		?>

		<p>Sorry! Something went wrong...</p>	

		<?               
		
		$form->display();
	}
	?>
	
	<script type="text/javascript"> window.setTimeout(function() { Util.changeContent("menu.php") }, 5000)</script>  
	
	<?
}
else {
	
	?>
	
	<p>Please register to create a new user-account</p>
	<p>This will allow you to create your own levels and more...</p>
	
	<?
	                                                                                         
	$form->display();
}

?>
