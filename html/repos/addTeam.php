<?php
require "Tables/TeamRepository.php";
$name = $_POST['teamName'];
$project = $_POST['project'];

if (isset($name) && isset($project) && $project > 0) {
	$db = new TeamRepository();
	$db->addTeam($name, $project);
}
?>