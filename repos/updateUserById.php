<?php
require "Tables/User.php";
$id = $_POST['id'];
$first = $_POST['firstName'];
$last = $_POST['lastName'];
$email = $_POST['email'];
if (isset($id) && $id > 0 && isset($email)) {
	$db = new User();
	$db->updateUserById($id, $first, $last, $email);
}
?>