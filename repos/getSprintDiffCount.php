<?php
require "Tables/TaskRepository.php";
// $id = $_POST['id'];
$id = 2;
if(isset($id) && $id > 0) {
	$db = new TaskRepository();
	$data = $db->getDiffCountForSprint($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>