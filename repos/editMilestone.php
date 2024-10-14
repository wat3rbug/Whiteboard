<?php
require "Tables/MilestoneRepository.php";
$id = $_POST['id'];
$name = $_POST['name'];

if (isset($id) && isset($name) && $id > 0) {
	$db = new MilestoneRepository();
	$db->editMilestone($id, $name);
}
?>