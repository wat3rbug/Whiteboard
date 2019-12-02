<?php
require "Tables/TeamMembers.php";
require "Tables/Team.php";

$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new TeamMember();
	$db->removeTeamMembersByTeam($id);
	$db = new Team();
	$db->removeTeam($id);
}
?>