<?php
require "Tables/MilestoneRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new MilestoneRepository();
	$db->removeMilestone($id);
}
?>