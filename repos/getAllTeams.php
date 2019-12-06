<?php
require "Tables/TeamRepository.php";
$db = new TeamRepository();
$data = $db->getAllTeams();
header('Content-type: application/json');
echo json_encode($data);
?>