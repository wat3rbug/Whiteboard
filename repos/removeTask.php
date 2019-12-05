<?php
require "Tables/TaskRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new Task();
	$db->removeTask($id);
}
?>