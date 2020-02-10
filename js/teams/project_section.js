$(document).ready(function () {

	buildProjectTable();	
	
	// do team selector portion
	
	$().change(function () {
		// find row with this selector
		$.ajax({
			url: "repos/changeTeamForProject.php",
			type: "post",
			data: {
				"project": project,
				"team": team
			},
			success: function() {
				buildProjectTable();
			}
		});
	});
});

function buildProjectTable() {
	$.ajax({
		url: "repos/getAllSkills.php",
		dataType: "json",
		success: function(skills) {
			$.ajax({
				url: "repos/getAllTeams.php",
				dataType: "json",
				success: function(teams) { 
					$.ajax({
						url: "repos/getAllProjects.php",
						dataType: "json",
						success: function(result) {
							$('#projectTable').find('tbody tr').remove();
							if (result != null) {
								result.forEach(function(project) {
									var row = "<tr><td>" + makeCardFromProject(project, teams, skills) + "</td></tr>";
									$('#projectTable').append(row);
								});
							}	
						}	
					});
				}	
			});	
		}
	});
}

function makeCardFromProject(project, teamNames) {
	var start = getDateFromString(project.start_date);
	var end = getDateFromString(project.end_date);
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + project.name + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Started: " + getWebDateFromDB(start);
	row += " <br>Projected End Date: " + getWebDateFromDB(end) + "</h6>";
	row += "<p class='card-text'>Description: ";
	if (project.description != null) row += project.description;
	row += "</p>";
	row += "<select class='browser-default custom-select' id='teamSelector_" + project.id + "'>";
	row += "<option value='0'>-- None Selected --</option>"; 
	if (teamNames != null) {
		teamNames.forEach(function(team) {
			if (team.project == project.id) {
				row += "<option selected value='" + team.id + "'>" + team.name + "</option>";
			} else {
				row += "<option value='" + team.id + "'>" + team.name + "</option>";
			}
		});
	}		
	row += "</select></div></div>";
	return row;
}