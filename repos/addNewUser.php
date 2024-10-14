<?php
require "Tables/UserRepository.php";
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($firstName) && isset($lastName) && isset($email) && isset($password)) {
	$db = new UserRepository();
	$db->addNewUser($firstName, $lastName, $email, $password);
}
?>