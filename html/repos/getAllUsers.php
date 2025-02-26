<?php
require "Tables/UserRepository.php";
$db = new UserRepository();
$data = $db->getAllUsers();
header('Content-type: application/json');
echo json_encode($data);
?>