<?php
require "Tables/TeamRepository.php";
$id = $_POST['id'];
$name = $_POST['name'];
$project = $_POST['project'];

if (isset($id) && $id > 0 && isset($project) && $project > 0 && isset($name)) {
	$db = new TeamRepository();
	$db->updateTeam($id, $name, $project);
}
?>