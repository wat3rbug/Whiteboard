<?php
require "Tables/UserRepository.php";
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($email) && isset($password)) {
	$db = new UserRepository();
	$result = $db->verifyUser($email, $password);
	echo $result;
}
?>