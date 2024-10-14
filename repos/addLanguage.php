<?php
require "Tables/LanguageRepository.php";
$language = $_POST['language'];

if (isset($language)) {
	$db = new LanguageRepository();
	$db->addLanguage($language);
}
?>