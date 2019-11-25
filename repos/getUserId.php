<?php
require "Tables/User.php";
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($password) && isset($email)) {
	$db = new User();
	$id = $db->getUserIdFromLogin($email, $password);
	echo $id;
}
?>