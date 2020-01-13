<?php
require "Tables/LanguageRepository.php";
$db = new LanguageRepository();
$data = $db->getAllLanguagesForProjects();
header('Content-type: application/json');
echo json_encode($data);
?>