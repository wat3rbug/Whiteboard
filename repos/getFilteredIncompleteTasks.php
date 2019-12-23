<?php
require "Tables/TaskRepository.php";
$id =$_POST['id'];

if (isset($id)) {
	$db = new TaskRepository();
	if ($id == 0) {
		$data = $db->getAllIncompleteTasks();
	} else {
		$data = $db->getFilteredIncompleteTasks($id);
	}
	header('Content-type: application/json');
	echo json_encode($data);
}
?>