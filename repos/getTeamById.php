<?php
require "Tables/TeamRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new TeamRepository();
	$data = $db->getTeamById($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>