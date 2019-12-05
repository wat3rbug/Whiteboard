<?php
require "Tables/TeamMemberRepository.php";
require "Tables/TeamRepository.php";

$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new TeamMember();
	$db->removeTeamMembersByTeam($id);
	$db = new Team();
	$db->removeTeam($id);
}
?>