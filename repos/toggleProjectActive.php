<?php
require "Tables/ProjectRepository.php";
$project = $_POST['project'];

if (isset($project) && $project > 0) {
	$db = new ProjectRepository();
	$db->toggleProjectActive($project);
}
?>