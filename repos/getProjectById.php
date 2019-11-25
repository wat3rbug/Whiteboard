<?php
require "Tables/Project.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new Project();
	$data = $db->getProjectById($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>