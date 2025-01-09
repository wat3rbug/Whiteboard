<?php
require "Tables/ProjectTeamRepository.php";
// $team= $_POST['team'];
// $project = $_POST['project'];
$team = "1";
$project = "11";

if (isset($team) && isset($project)) {
	$db = new ProjectTeamRepository();
	$hasteam = $db->doesProjectHaveTeam($project);
    var_dump($hasteam);
    
    if ($hasteam == true) {
        $db->updateProjectTeam($project, $team);
    } else {
        $db->addProjectTeam($project, $team);
    }
}
?>