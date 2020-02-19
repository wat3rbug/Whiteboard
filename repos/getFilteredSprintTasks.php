<?php
require "Tables/TaskRepository.php";
$sprint = $_POST['sprint'];
$filter = $_POST['filter'];

if (isset($sprint) && $sprint > 0) {
	$db = new TaskRepository();
	$data = array();
	if (isset($filter) && $filter > 0) {
		$data = $db->getFilteredSprintTasks($sprint, $filter);
	} else {
		$data = $db->getSprintTasks($sprint);
	}	
	header('Content-type: application/json');
	echo json_encode($data);
}
?>