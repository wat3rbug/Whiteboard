<?php
require "Tables/ProjectRepository.php";
$db = new ProjectRepository();
$data = $db->getActiveProjectNameAndIds();
header('Content-type: application/json');
echo json_encode($data);
?>