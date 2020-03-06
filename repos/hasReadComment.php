<?php
require "Tables/CommentRepository.php";
// $id = $_POST['id'];
$id = 6;
if (isset($id) && $id > 0) {
	$db = new CommentRepository();
	$db->hasReadComment($id);
}
?>