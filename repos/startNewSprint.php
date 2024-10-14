<?php
require "Tables/SprintRepository.php";
require "Tables/TaskRepository.php";
$taskRepo = new TaskRepository();
$sprintRepo = new SprintRepository();

// get id of old sprint

$data = $sprintRepo->getLatestSprint();
$oldid = $data[0]['id'];

// complete sprint

$sprintRepo->completeSprint($oldid);

// create new sprint

$sprintRepo->createNewSprint();
$data = $sprintRepo->getLatestSprint();
$newid = $data[0]['id'];

// update tasks to new sprint id where they are not completed and sprint is not null

$taskRepo->updateUnfinishedTasksToNewSprint($oldid, $newid);
?>