<?php
require "Tables/MilestoneRepository.php";
//$id = $_POST['id'];

$id =1;
if (isset($id) && $id > 0) {
	$db = new MilestoneRepository();
	$data = $db->getMilestonesForProject($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>