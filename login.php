<?php
/**
 * The content include for the login form
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><h2>Login</h2>

<?   
  	
if (!isset($_SESSION)) {
	
	session_start();
}

require_once("inc/class.form.php");
require_once("inc/class.user.php");


$form = new Form("login", array(
			  
       "name" => array(   

		'type' => 'text',
		'label' => 'Name',
		'dbStore' => true,
		'validators' => array(
		    'required'
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
		) 
	) 
);                       

if (isset($_POST["submit"])) {
	    
	$user = new User(null);
	$logged_in = $user->login();
		if ($logged_in) {
		 
		$_SESSION["user_id"] = $logged_in
		?>

		<script> Util.changeContent("menu.php"); </script>

		<?
	}
	else {
	  
		?>

		<p>Sorry! Please try again...</p>	

		<?               
		
		$form->display();
	}
}
else {
	
	?>
	
	<p>Please register to create a new user-account, which will allow you to create your own levels and more...</p>
	
	<?
	                                                                                         
	$form->display();
}

?> 