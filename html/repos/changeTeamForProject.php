<?php
require "Tables/TeamRepository.php";
// $team= $_POST['team'];
// $project = $_POST['project'];
$team = "1";
$project = "11";

if (isset($team) && isset($project)) {
	$db = new TeamRepository();
	$hasteam = $db->doesProjectHaveTeam($project);
    var_dump($hasteam);
    
    if ($hasteam == true) {
        $data = getTeamById($team);
        
        $db->updateTeam($project, $team);
    } else {
        $db->addTeam($team, $project);
    }
}
?>