<?php
require "Tables/TaskRepository.php";
$db = new TaskRepository();
$data = $db->getAllIncompleteTasks();
header('Content-type: application/json');
echo json_encode($data);
?>