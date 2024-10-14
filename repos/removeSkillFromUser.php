<?php
require "Tables/SpecialtiesRepository.php";
$id = $_POST['id'];

if (isset($id) && $id >0 ) {
	$db = new SpecialtiesRepository();
	$db->removeSkillFromUser($id);
}
?>