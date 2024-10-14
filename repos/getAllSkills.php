<?php
require "Tables/SpecialtiesRepository.php";
$db = new SpecialtiesRepository();
$data = $db->getAllSkills();
header('Content-type: application/json');
echo json_encode($data);
?>