<?php
require "Tables/TeamMemberRepository.php";
$user = $_POST['user'];
$team = $_POST['team'];

if (isset($user) && isset($team) && $user > 0 && $team > 0) {
	$db = new TeamMemberRepository();
	$db->addUserToTeam($user, $team);
}
?>