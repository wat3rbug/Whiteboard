<?php
require "Tables/TaskRepository.php";
$id = $_POST['id'];
$state = $_POST['state'];

if (isset($id) && isset($state) && $id > 0) {
	$db = new TaskRepository();
	$data =$db->getStateForTask($id);
	$prevState = $data[0]['state'];
	$db->changeState($id, $state);
	if ($prevState == "0") {
		$db->updateStart($id, $state);
	}
	else if ($prevState == "0" && $state == "4") {
		// echo "from assigned to completed";
		$db->updateEnd($id, $state);
	}
	else if ($prevState == "1" && ($state == "2" || $state == "4")) {
		// echo "from work in progress to staged or completed";
		$db->updateEndAndCalcTime($id, $state);
	}
	else if ($prevState == "2" && $state == "3") {
		// echo "from staged to testing";
		$db->updateStart($id, $state);
	}
	else if ($prevState == "2" || $prevState == "3" && $state == "4") {
		// echo "from staged or testing to complete";
		$db->updateEndAndCalcTime($id, $state);
	}
	if ($state == "4") {
		// echo "marked complete";
		$db->completeTask($id);
	}
	else {
		$db->incompleteTask($id);
		// echo "marked incomplete";
	}
}
?>