<?php
require "Tables/TaskRepository.php";
//$user = $_POST['user'];

$user = 1;
if (isset($user) && $user > 0) {
	$db = new TaskRepository();
	$data = $db->getCompletedTaskTimesForUser($user);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>