<?php
require "Tables/TeamMembers.php";
$user = $_POST['user'];
$team = $_POST['team'];

if (isset($user) && isset($team) && $user > 0 && $team > 0) {
	$db = new TeamMember();
	$db->removeUserFromTeam($user, $team);
}
?>