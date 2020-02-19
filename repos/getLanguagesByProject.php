<?php
require "Tables/LanguageRepository.php";
$id = $_POST['id'];

if (isset($id) && $id > 0) {
	$db = new LanguageRepository();
	$data = $db->getLanguagesForProject($id);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>