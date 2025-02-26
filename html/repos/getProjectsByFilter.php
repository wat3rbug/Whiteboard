<?php
require "Tables/ProjectRepository.php";
$active = $_POST['active'];

if (isset($active) && ($active == "0" || $active == "1")) {
	$db = new ProjectRepository();
	$data = $db->getProjectsByFilter($active);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>