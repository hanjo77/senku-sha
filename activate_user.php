<?php
/**
 * This page should be opened after the user clicks the activation
 * link of the confirmation mail message
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */
?><!DOCTYPE HTML>
<html>
<head> 
	<meta charset="UTF-8">
	<title>先駆者</title>
	<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet' type='text/css' />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<script type="text/javascript" src="js/lib/jquery.min.js"></script>
	<script type="text/javascript" src="js/util.js"></script>
</head>
<body>      
	<div id="bgBall" style="display: block"></div>
	<div id="contentWrapper">
		<div id="content">
			<h1>先駆者</h1>
			<h2>Senku-Sha</h2>
			<?

				include_once("inc/class.user.php");
				$user = new User($_GET["id"]);
				if ($user->activate($_GET["h"])) {
	
				?>
	
				<p>Thank you for activating your account.</p>
				<p>You may now log in to access some more features.</p>
				
	
				<?
	
				}
				else {
	
				?>
	
				<p>Something went wrong!</p>
				<p>Please try again.</p>
	
				<?
	
				}
	
			?>
			<a href="./#" class="menuButton">Continue</a>
		</div>
		<script>
			
		$("#content").center();
			
		</script>
	</div>
</body>
