<?php
require "Tables/Team.php";
$name = $_POST['teamName'];
$project = $_POST['project'];

if (isset($name) && isset($project) && $project > 0) {
	$db = new Team();
	$db->addTeam($name, $project);
}
?>