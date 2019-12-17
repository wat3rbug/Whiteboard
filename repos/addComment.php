<?php
require "Tables/CommentRepository.php";
$task = $_POST['task'];
$user = $_POST['user'];
$comment = $_POST['comment'];

if (isset($task) && isset($user) && isset($comment) && $task > 0 && $user > 0) {
	$db = new CommentRepository();
	$db->addComment($task, $user, $comment);
}
?>