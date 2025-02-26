<?php
require "Tables/SprintRepository.php";
$db = new SprintRepository();
$data = $db->getHighestSprintNumber();
header('Content-type: application/json');
echo json_encode($data);
?>