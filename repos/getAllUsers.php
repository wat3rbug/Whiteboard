<?php
require "Tables/User.php";
$db = new User();
$data = $db->getAllUsers();
header('Content-type: application/json');
echo json_encode($data);
?>