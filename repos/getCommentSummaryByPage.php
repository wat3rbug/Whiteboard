<?php
require "Tables/CommentRepository.php";
$date = date('y-m-d', strtotime('-30 days'));
$page = $_POST['page'];
$count = $_POST['count'];

$db = new CommentRepository();
$data = $db->getCommentSummaryByPage($date, $page, $count);
header('Content-type: application/json');
echo json_encode($data);
?>