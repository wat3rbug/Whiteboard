<?php
require "Tables/Task.php";
$id = $_POST['id'];
$subject = $_POST['subject'];
$description = $_POST['description'];
$diff = $_POST['diff'];
$project = $_POST['project'];

if (isset($id) && isset($subject) && isset($diff) && isset($project) && $id > 0  && $project > 0) {
	$db = new Task();
	$db->updateTask($id, $subject, $description, $diff, $project);
}
?>