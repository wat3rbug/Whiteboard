<?php
require "Tables/TeamName.php";
$db = new TeamName();
$data = $db->getAllTeamNames();
header('Content-type: application/json');
echo json_encode($data);
?>