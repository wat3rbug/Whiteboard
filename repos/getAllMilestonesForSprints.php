<?php
require "Tables/TaskRepository.php";
$db = new TaskRepository();
$data = $db->getAllMilestonesForSprints();
header('Content-type: application/json');
echo json_encode($data);
?>