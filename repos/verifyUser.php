<?php
require "Tables/User.php";
// $email = $_POST['email'];
// $password = $_POST['password'];
$email = "doug.gardiner@gmail.com";
$password = "saxpuz-Junfu5-jegbem";

if (isset($email) && isset($password)) {
	$db = new User();
	$result = $db->verifyUser($email, $password);
	echo $result;
}
?>