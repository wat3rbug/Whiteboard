<?php
require "Tables/LanguageRepository.php";

$project = $_POST['project'];
$lang = $_POST['lang'];

if (isset($project) && isset($lang) && $project > 0 && $lang > 0) {
	$db = new LanguageRepository();
	$db->removeLangFromProject($project, $lang);
}
?>