<?php
require "Tables/LanguageRepository.php";
$project = $POST['project'];
$lang = $_POST['lang'];

$project =1;
$lang = 4;
if (isset($project) && isset($lang) && $project > 0 && $lang > 0) {
	$db = new LanguageRepository();
	$data = $db->getLanguageForProject($project, $lang);
	if ($data != null) {
		$db->undeleteLanguageForProject($project, $lang);		
	} else {
		$db->addLanguageToProject($project, $lang);
	}
}
?>