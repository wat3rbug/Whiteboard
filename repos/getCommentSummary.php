<?php
require "Tables/CommentRepository.php";
$date = date('y-m-d', strtotime('-30 days'));
$db = new CommentRepository();
$data = $db->getCommentSummary($date);
header('Content-type: application/json');
echo json_encode($data);
?>