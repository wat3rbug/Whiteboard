<?php
require "Tables/LanguageRepository.php";
$db = new LanguageRepository();
$data = $db->getSpecialtyForUsers();
header('Content-type: application/json');
echo json_encode($data);
?>