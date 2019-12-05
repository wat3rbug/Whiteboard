<?php
require "Tables/ProjectRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new Project();
	$db->removeProject($id);
}
?>