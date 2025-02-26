<?php
require "Tables/TeamMemberRepository.php";
$team = $_POST['team'];

if (isset($team) && $team > 0) {
	$db = new TeamMemberRepository();
	$data = $db->getAllUnassignedUsers($team);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>