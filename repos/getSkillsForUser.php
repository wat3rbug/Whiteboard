<?php
require "Tables/SpecialtiesRepository.php";
$id = $_POST['id'];

$id = 1;
if (isset($id) && $id > 0) {
	$db = new SpecialtiesRepository();
	$data = $db->getSkillsByUser($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>