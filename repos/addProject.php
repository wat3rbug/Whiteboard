<?php
require "Tables/ProjectRepository.php";
$name = $_POST['name'];
$description = $_POST['description'];
$start = $_POST['start'];
$end = $_POST['end'];

if (isset($name) && isset($start) && isset($end)) {
	$db = new ProjectRepository();
	$db->addProject($name, $description, $start, $end);
}
?>