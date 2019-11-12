<?php
require "Tables/User.php";
// $firstName = $_POST['firstName'];
// $lastName = $_POST['lastName'];
// $email = $_POST['email'];
$firstName = "Douglas";
$lastName = "Gardiner";
$email = "doug.gardiner@gmail.com";

if (isset($firstName) && isset($lastName) && isset($email)) {
	$db = new User();
	$count = $db->getNameAndEmailCount($firstName, $lastName, $email);
	echo $count;
}
?>