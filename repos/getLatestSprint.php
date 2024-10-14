<?php
require "Tables/SprintRepository.php";
$db = new SprintRepository();
$data = $db->getLatestSprint();
header('Content-type: application/json');
echo json_encode($data);
?>