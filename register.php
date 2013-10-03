<h2>Registration</h2>

<?   
  	
require_once("inc/form.php");  

$form = new Form("users", array(
			  
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
		if ($response) {
		
		?>

		<p>Thanks for your registration!</p>
		<p>You will receive a message by e-mail to activate your account in a moment.</p>
		<script type="text/javascript"> window.setTimeout(function() { Util.exit() }, 5000)</script>  

		<?
	}
	else {
	  
		?>

		<p>Sorry! Something went wrong...</p>	

		<?               
		
		$form->display();
	}
}
else {
	
	?>
	
	<p>Please register to create a new user-account</p>
	<p>This will allow you to create your own levels and more...</p>
	
	<?
	                                                                                         
	$form->display();
}

?>