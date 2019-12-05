<?php
require "Tables/ProjectRepository.php";
$db = new Project();
$data = $db->getAllProjectsAndTeams();
header('Content-type: application/json');
echo json_encode($data);
?>