<?php
require "Tables/TaskRepository.php";
require "Tables/UserRepository.php";
require "Tables/SprintRepository.php";
$email = $_POST['email'];
$password = $_POST['password'];


if (isset($email) && isset($password)) {
	
	// get user id from login credentials
	
	$db =new UserRepository();
	$data = $db->getUserIdFromLogin($email, $password);
	$userid = $data[0]['id'];

	// get sprint id and start_date
	
	$db = new SprintRepository();
	$data = $db->getLatestSprint();
	$sprintid = $data[0]['id'];
	$startdate = $data[0]['start_date'];

	// get sprint count for user
	
	$db = new TaskRepository();
	$data = $db->getDiffCountForSprintForUser($userid, $sprintid);
	$diffcount = $data[0]['count'];
	if ($diffcount == null) $diffcount = 0;
	
	// get count left for user

	$data = $db->getCompletedDiffForSprintForUser($userid, $sprintid);
	$completed = $data[0]['count'];
	if ($completed == null) $completed = 0;
	$left = strval($diffcount - $completed);

	$data = array("sprintid" => $sprintid, "start_date" => $startdate, "total" => $diffcount, "points_left" => $left);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>