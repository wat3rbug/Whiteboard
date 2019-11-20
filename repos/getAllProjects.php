<?php
require "Tables/Project.php";
$db = new Project();
$data = $db->getAllProjects();
header('Content-type: application/json');
echo json_encode($data);
?>