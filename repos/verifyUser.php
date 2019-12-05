<?php
require "Tables/User.php";
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($email) && isset($password)) {
	$db = new User();
	$result = $db->verifyUser($email, $password);
	echo $result;
}
?>