<?php
require "Tables/TaskRepository.php";
$id= $_POST['id'];
$state = $_POST['state'];

$id = 12;
$state = 0;
if (isset($id) && isset($state) && $id > 0) {
	$db = new TaskRepository();
	$db->changeStateForTask($id, $state);
}
?>