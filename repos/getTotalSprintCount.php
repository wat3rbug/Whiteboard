<?php
require "Tables/SprintRepository.php";
$db = new SprintRepository();
$data = $db->getTotalCount();
header('Content-type: application/json');
echo json_encode($data);
?>