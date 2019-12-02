<?php
require "Tables/TeamMembers.php";
$team = $_POST['team'];

if (isset($team) && $team > 0) {
	$db = new TeamMember();
	$data = $db->getAllUnassignedUsers($team);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>