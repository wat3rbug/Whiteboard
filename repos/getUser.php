<?php
require "Tables/User.php";
$email = $_POST['email'];
$password = $_POST['password'];
if (isset($email) && isset($password)) {
	$db = new User();
	$data = $db->getUserFromLoginCreds($email, $password);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>