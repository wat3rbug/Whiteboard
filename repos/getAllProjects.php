<?php
require "Tables/ProjectRepository.php";
$db = new ProjectRepository();
$data = $db->getAllProjects();
header('Content-type: application/json');
echo json_encode($data);
?>