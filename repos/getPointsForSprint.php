<?php
require "Tables/TaskRepository.php";
$sprint = $_POST['id'];

$sprint = 2;
if (isset($sprint) && $sprint > 0) {
	$db = new TaskRepository();
	$data = $db->getDiffCountForSprint($sprint);
	$data2 = $db->getCompletedDiffForSprint($sprint);
	$result = array($data[0]['count'], $data[0]['count'] - $data2[0]['count']);
	header('Content-type: application/json');
	echo json_encode($result);
}
?>