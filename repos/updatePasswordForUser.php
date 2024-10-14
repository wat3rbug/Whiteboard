<?php
require "Tables/UserRepository.php";
$email = $_POST['email'];
$password = $_POST['old'];
$newpassword = $_POST['new'];

if (isset($email) && isset($old) && isset($new)) {
	$db = new UserRepository();
	$db->updatePasswordForUser($email, $old, $new);
}
?>