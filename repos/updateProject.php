<?php
require "Tables/ProjectRepository.php";
$id = $_POST['id'];
$name = $_POST['name'];
$desc = $_POST['description'];
$start = $_POST['start'];
$end = $_POST['end'];

if (isset($id) && $id > 0 && isset($name) && isset($start) && isset($end)) {
	$db = new ProjectRepository();
	$db->updateProject($id, $name, $desc, $start, $end);
}
?>