<?php
require "Tables/UserRepository.php";
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];


if (isset($firstName) && isset($lastName) && isset($email)) {
	$db = new UserRepository();
	$count = $db->getNameAndEmailCount($firstName, $lastName, $email);
	echo $count;
}
?>