<?php
require "Tables/User.php";
$email = $_POST['email'];
$password = $_POST['old'];
$newpassword = $_POST['new'];

if (isset($email) && isset($old) && isset($new)) {
	$db = new User();
	$db->updatePasswordForUser($email, $old, $new);
}
?>