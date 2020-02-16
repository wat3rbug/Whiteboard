<?php
require "Tables/MilestoneRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new MilestoneRepository();
	$data = $db->getMilestoneById($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>