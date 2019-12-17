<?php
require "Tables/TaskRepository.php";
$sprint = $_POST['sprint'];
$id = $_POST['id'];
$sprint = 2;
if (isset($sprint) && isset($id) && $id > 0 && $sprint > 0) {
	$db = new TaskRepository();
	$data = $db->getDiffCountForSprintForUser($id, $sprint);
	$data2 = $db->getCompletedDiffForSprintForUser($id, $sprint);
	$result = array($data[0]['count'], $data[0]['count'] - $data2[0]['count']);
	header('Content-type: application/json');
	echo json_encode($result);
}
?>