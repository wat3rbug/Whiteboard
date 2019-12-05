<?php
require "Tables/UserRepository.php";
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($password) && isset($email)) {
	$db = new User();
	$data = $db->getUserIdFromLogin($email, $password);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>