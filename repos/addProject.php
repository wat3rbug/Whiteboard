<?php
require "Tables/Project.php";
$name = $_POST['name'];
$description = $_POST['description'];
$start = $_POST['start'];
$end = $_POST['end'];

if (isset($name) && isset($start) && isset($end)) {
	$db = new Project();
	$db->addProject($name, $description, $start, $end);
}
?>