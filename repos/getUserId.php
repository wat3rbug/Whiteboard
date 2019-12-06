<?php
require "Tables/UserRepository.php";
$email = $_POST['email'];
$password = $_POST['password'];

$email = "doug.gardiner@gmail.com";
$password = "jojhyv-duvqaq-Mebza5";

if (isset($password) && isset($email)) {
	$db = new UserRepository();
	$data = $db->getUserIdFromLogin($email, $password);
	echo $data[0]['id'];
}
?>