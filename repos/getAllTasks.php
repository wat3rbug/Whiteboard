<?php
require "Tables/TaskRepository.php";
$filter = $_POST['filter'];

$db = new TaskRepository();
if (isset($filter) && $filter > 0) {
	$data = $db->getFilteredTasks($filter);
} else {
	$data = $db->getAllTasks();
}
header('Content-type: application/json');
echo json_encode($data);
?>