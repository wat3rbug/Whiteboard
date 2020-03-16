$(document).ready(function() {

	$.ajax({
		url: "repos/getTotalSprintCount.php",
		dataType: "json",
		success: function(results) {
			if (results.length == 3 && results != null) {
				$('#sprints').text(results[0]['count']);
				$('#totals').text(results[1]['count']);
				$('#totalComplete').text(results[2]['count']);
			}
		}
	});
	
	$.ajax({
		url: "repos/getAllMilestonesForSprints.php",
		dataType: "json",
		success: function(milestoneResults) {
			$.ajax({
				url: "repos/getAllSprintProjectSummary.php",
				dataType: "json",
				success: function(results) {
					if (results != null && results.length > 0) {
						$('#sprintTable').find('tbody tr').remove();
						results.forEach(function(sprintProjSum) {
							var row = "<tr><td>" + sprintProjSum['sprint'] + "</td><td>";
							row += "<button type='button' class='btn btn-link'  onClick='getProjectDetails(";
							row +=  sprintProjSum['project_id'] + ")'>" + sprintProjSum['project'] + "</button></td>";
							row += "<td>" + sprintProjSum['sumdiff'] + "</td>";
							row += "<td><button type='button' class='btn btn-link' onClick='getTeamMembers(";
							row += sprintProjSum['sprint'] + ")'>" + sprintProjSum['team'] + "</td><td>";
							// this is horrible hackiness, i should be able to filter by sprint, but it is not working
							for (i = 0 ; i < milestoneResults.length; i++) {
								if (sprintProjSum['sprint'] == milestoneResults[i]['sprint']) {
									var project = sprintProjSum['project'];
									if (project.localeCompare(milestoneResults[i]['project']) == 0) {
										row += milestoneResults[i]['name'];
									}
								}
							}
							row += "</td></tr>";
							$('#sprintTable').append(row);
						});
					}
				}
			});
		}
	});
});

function getProjectDetails(id) {
	$('#projectDetailsModal').modal('show');
	displayProjectDetails(id);
}
