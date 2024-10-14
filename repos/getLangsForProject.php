<?php
require "Tables/LanguageRepository.php";
$project = $_POST['project'];

if (isset($project) && $project > 0) {
	$db = new LanguageRepository();
	$data = $db->getLanguagesForProject($project);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>