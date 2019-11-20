<?php
require "Tables/Team.php";
$db = new Team();
$data = $db->getAllTeams();
header('Content-type: application/json');
echo json_encode($data);
?>