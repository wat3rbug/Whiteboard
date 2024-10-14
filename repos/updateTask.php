<?php
require "Tables/TaskRepository.php";
$id = $_POST['id'];
$subject = $_POST['subject'];
$description = $_POST['description'];
$diff = $_POST['diff'];
$project = $_POST['project'];
$type = $_POST['type'];

if (isset($id) && isset($subject) && isset($diff) && isset($project) && $id > 0  && $project > 0 && isset($type)) {
	$db = new TaskRepository();
	$db->updateTask($id, $subject, $description, $diff, $project, $type);
}
?>