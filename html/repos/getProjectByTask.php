<?php
require "Tables/TaskRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new TaskRepository();
	$data = $db->getProjectByTask($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>