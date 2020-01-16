<?php
require "Tables/SpecialtiesRepository.php";
$user = $_POST['user'];
$skill = $_POST['skill'];

if (isset($skill) && isset($user) && $user > 0 && $skill > 0) {
	$db = new SpecialtiesRepository();
	$db->addSkillForUser($skill, $user);
}
?>