<?php
require "Tables/TeamMembers.php";
$team = $_POST['id'];

if (isset($team) && $team > 0) {
	$db = new TeamMember();
	$data =$db->getMembersForTeam($team);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>