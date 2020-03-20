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
				type: "post",
				dataType: "json",
				success: function(results) {
					if (results != null && results.length > 0) {
						$('#sprintTable').find('tbody tr').remove();
						results.forEach(function(sprintProjSum) {
							var row = "<tr><td>" + sprintProjSum['sprint'] + "</td>";
							
							row += "<td><button type='button' class='btn btn-link'  onClick='getProjectDetails(";
							row +=  sprintProjSum['project_id'] + ")'>" + sprintProjSum['project'] + "</button></td>";
							
							row += "<td><button type='button' class='btn btn-link' onClick='getProjectSummary(";
							row += sprintProjSum['sprint'] + ", " + sprintProjSum['project_id'] + ")'>";
							row += sprintProjSum['sumdiff'] + "</button></td>";
							
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

var MIN = 100;
var HOUR = 10000;
var DAY = 240000;

function getProjectSummary(sprint, project) {
	$.ajax({
		url: "repos/getSprintPointsForProject.php",
		type: "post",
		dataType: "json",
		data: {
			"project": project,
			"sprint": sprint
		},
		success: function(results) {
			$('#projectSummaryModal').modal('show');
			$('#projectSummary').find('tbody tr').remove();
			if (results != null && results.length > 0) {
				results.forEach(function(summary) {
					var row = "<tr><td>" + summary['difficulty'] + "</td>";
					row += "<td>" + longToHours(summary['hours']) + "</td>";
					row += "<td>" + summary['subject'] + "</td>";
					row += "<td><button type='button' class='btn btn-link' onClick='getTaskComments(";
					row += summary['id'] + ")'>Comments</button></td></tr>";
					$('#projectSummary').append(row);	
				});
			} else {
				var row = "<tr><td colspan='4' class='text-center'>No Data</td></tr>";
				$('#projectSummary').append(row);
			}
		}	
	});
}

function getTaskComments(task) {
	$.ajax({
		url: "repos/viewPriorComments.php",
		dataType: "json",
		type: "post",
		data: {
			"id": task
		},
		success: function(results) {
			$('#taskCommentModal').modal('show');
			$('#commentSummary').find('tbody tr').remove();
			if (results != null && results.length > 0) {
				results.forEach(function(commentRow) {
					var row = "<tr><td>" + commentRow['comment_date'] + "</td>";
					row += "<td>" + commentRow['comment'] + "</td>";
					row += "<td><a href='mailto:" + commentRow['email'] + "'>" + commentRow['first_name'];
					row += " " + commentRow['last_name'] + "</a></td></tr>";
					$('#commentSummary').append(row);	
				});
			} else {
				$('#commentSummary').append("<tr><td colspan='3' class='text-center'>No Comments</td></tr>");
			}
		}
	})
}

function getTeamMembers(team) {
	$.ajax({
		url: "repos/getTeamMembersForTeam.php",
		type: "post",
		dataType: "json",
		data: {
			"team": team
		},
		success: function(results) {
			
			$('#teamDetailsModal').modal('show');
			
		}
	});
}

function longToHours(original) {
	var days = Math.floor(original / DAY);
	var daysamount = days * DAY;
	var hours = Math.floor((original - daysamount) / HOUR);
	var hoursamount = hours * HOUR;
	var mins = Math.floor((original - (daysamount + hoursamount)) / MIN);
	return  days + " D " + hours + ":" + mins + " Hrs";
}

function getProjectDetails(id) {
	$('#projectDetailsModal').modal('show');
	displayProjectDetails(id);
}
