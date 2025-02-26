<?php
require "Tables/TaskRepository.php";

$db = new TaskRepository();
$data = $db->getAllSprintProjectSummary();
header('Content-type: application/json');
echo json_encode($data);
?>