<?php
/**
 * Configuration settings for Senku-Sha
 * PHP Version 5.0.0
 * @package SenkuSha
 * @author Hansjürg Jaggi (hanjo) <hanjo77@gmail.com>
 */

class Config {

    public $self = array();

    // Database server connection settings

    public static $db = array(

        "server" => "127.0.0.1",
        "name" => "senku-sha",
        "user" => "senku-sha",
        "password" => "53nku-5h4"
    );

    // Email server connection settings

    public static $mail = array(

        "server" => "ssl://smtp.mydomain.com",
        "user" => "********",
        "password" => "********",
        "address" => "senku-sha@mydomain.net"
    );

}