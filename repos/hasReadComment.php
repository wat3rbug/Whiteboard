<?php
require "Tables/CommentRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new CommentRepository();
	$db->hasReadComment($id);
}
?>