<?php
require "Tables/LanguageRepository.php";
$db = new LanguageRepository();
$data = $db->getAllLanguagesForProjects();
if (isset($data)) {
	header('Content-type: application/json');
	echo json_encode($data);
}
?>