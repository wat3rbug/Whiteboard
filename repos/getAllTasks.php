<?php
require "Tables/Task.php";
$db = new Task();
$data = $db->getAllTasks();
header('Content-type: application/json');
echo json_encode($data);
?>