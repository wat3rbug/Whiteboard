<?php
require "Tables/TeamMemberRepository.php";
require "Tables/TeamRepository.php";

$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new TeamMemberRepository();
	$db->removeTeamMembersByTeam($id);
	$db = new TeamRepository();
	$db->removeTeam($id);
}
?>