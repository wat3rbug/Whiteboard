<?php
require "Tables/TaskRepository.php";
require "Tables/UserRepository.php";
require "Tables/SprintRepository.php";
$email = $_POST['email'];
$password = $_POST['password'];
$filter = $_POST['filter'];

// $email = "doug.gardiner@gmail.com";
// $password = "jojhyv-duvqaq-Mebza5";
// $filter = 1;

if (isset($email) && isset($password)) {
	
	// get userid 
		
	$db = new UserRepository();
	$data = $db->getUserIdFromLogin($email, $password);
	$userid = $data[0]['id'];

	// get sprint id
	
	$db = new SprintRepository();
	$data = $db->getLatestSprint();
	$sprintid = $data[0]['id'];

	// get ordered tasks based on user and sprint
	
	$db = new TaskRepository();
	if (isset($filter) && $filter > 0) {
		$data = $db->getFilteredOrderedTasksForUser($userid, $sprintid, $filter);
	} else {
		$data = $db->getOrderedTasksForUser($userid, $sprintid);
	}
	header('Content-type: application/json');
	echo json_encode($data);
}
?>