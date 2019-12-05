<?php
require "Tables/User.php";
$email = $_POST['email'];
$password = $_POST['password'];

$email = "doug.gardiner@gmail.com";
$password = "jojhyv-duvqaq-Mebza5";


if (isset($email) && isset($password)) {
	$db = new User();
	$data = $db->getUserIdFromLogin($email, $password);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>