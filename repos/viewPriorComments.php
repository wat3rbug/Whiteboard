<?php
require "Tables/CommentRepository.php";
$task = $_POST['id'];

$task = 12;
if(isset($task) && $task > 0) {
	$db = new CommentRepository();
	$data = $db->viewPriorComments($task);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>