<?php
require "Tables/TaskRepository.php";
$id = $_POST['id'];
$sprint = $_POST['sprint'];

if (isset($id) && isset($sprint) && $id > 0 && $sprint > 0) {
	$db = new TaskRepository();
	$data = $db->getTaskForSprintByUserId($id, $sprint);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>