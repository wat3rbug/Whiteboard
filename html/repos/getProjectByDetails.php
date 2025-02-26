<?php
require "Tables/ProjectRepository.php";
$name = $_POST['name'];
$desc = $_POST['description'];
$start = $_POST['start'];
$end = $_POST['end'];

// $name = "Test";
// $start = '2020-01-13';
// $end = '2020-01-20';

if (isset($name) && isset($start) && isset($end)) {
	$db = new ProjectRepository();
	$data = $db->getProjectByDetails($name, $desc, $start, $end);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>