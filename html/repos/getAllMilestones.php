<?php
require "Tables/MilestoneRepository.php";
$db = new MilestoneRepository();
$data = $db->getAllMilestones();
header('Content-type: application/json');
echo json_encode($data);
?>