<?

session_start();         


?><!DOCTYPE HTML>
<html>
<head> 
	<meta charset="UTF-8">
	<title>先駆者</title>
	<link link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet' type='text/css' />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<script src="js/lib/three.min.js"></script>  
	<script src="js/lib/jquery.min.js"></script>
	<script src="js/config.js"></script>
	<script src="js/util.js"></script>
	<script src="js/user.js"></script>
	<script src="js/validation.js"></script>
	<script src="js/editor.js"></script>
	<script src="js/ball.js"></script>
	<script src="js/bg_ball.js"></script>
</head>
<body>      
	<div id="bgBall" style="display: block"></div>
	<div id="contentWrapper">
		<div id="content">
			<?
		
				if (isset($_POST["formName"])) {
		    
			    	switch($_POST["formName"]) {
			
						case "users":
							include("register.php");
							break;
			
						case "login":
							include("login.php");
							break;
					}
				}
				else {
				     
				
					include("menu.php");
				}
			
			?>
		</div>
	</div>
</body>