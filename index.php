<?php
/**
 * The main layout page
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

session_start();         


?><!DOCTYPE HTML>
<html>
<head> 
	<meta charset="UTF-8">
	<title>先駆者</title>
	<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Aldrich' rel='stylesheet' type='text/css' />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<script src="js/senku-sha.js"></script>
</head>
<body>      
	<div id="bgBall" style="display: block"></div>
	<div id="contentWrapper">
		<div id="content"></div>
	</div>
	<div id="timeDisplay"></div>
	<div id="info"></div>
	<div id="lifeDisplay"></div>
	<div id="debug"></div>
	<div id="noWebGL">
		<h2>Sorry!</h2>
		<p>Your browser currently does not seem to support WebGL.</p>
		<p>For an optimal viewing experience, please try</p>
		<p><a href="http://chrome.google.com" class="linkButton" target="_blank">Google&nbsp;Chrome</a></p>
	</div>
	<noscript>
		<h2>Sorry!</h2>
		<p>Your browser currently does not allow JavaScript.</p>
	</noscript>
</body>