<?php
require "Tables/TaskRepository.php";
$id = $_POST['sprint'];

if (isset($id) && $id > 0) {
	$db = new TaskRepository();
	$data = $db->getSprintTasks($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>