<?php
require "Tables/TeamMemberRepository.php";
$team = $_POST['team'];

if (isset($team)) {
	$db = new TeamMemberRepository();
	$data = $db->getTeamMembers();
	header('Content-type: application/json');
	echo json_encode($data);
}
?>