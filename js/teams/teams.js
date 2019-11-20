$(document).ready(function () {

	verifyUser();
	buildProjectTable();
	buildTeamTable();
});

function buildProjectTable() {
	var teamNames = [];
	$.ajax({
		url: "repos/getAllTeamNames.php",
		dataType: "json",
		success: function(teams) { 
			$.ajax({
				url: "repos/getAllProjects.php",
				dataType: "json",
				success: function(result) {
					$('#projectTable').find('tbody tr').remove();
					if (result != null) {
						result.forEach(function(project) {
							var row = "<tr><td>" + makeCardFromProject(project, teams) + "</td></tr>";
							$('#projectTable').append(row);
						});
					}	
				}	
			});
		}	
	});
	
}

function getAllTeamNames() {
	$.ajax({
		url: "repos/getAllTeamNames.php",
		dataType: "json",
		success: function(teams) {
			if (teams != null) return teams;
		}
	});
}

function getProjects() {
	$.ajax({
		url: "repos/getAllProjects.php",
		dataType: "json",
		success: function(result) {
			if (result != null) {
				return result;
			}
		}
	});
}

function buildTeamTable() {
	$.ajax({
		url: "repos/getAllTeamNames.php",
		dataType: "json",
		success: function(result) {
			$('#teamTable').find('tbody tr').remove();
			if (result != null) {
				result.forEach(function(team) {
					var row = "<tr><td>" + team.name + "</td></tr>";
					$('#teamTable').append(row);
				});
			}	
		}	
	});
}
function verifyUser() {
	var password = sessionStorage['password'];
	var email =	sessionStorage['email'];
	$.ajax({
		url: "repos/verifyUser.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(result) {
			if (result != "1") {
				window.location.replace("index.html");
			}
		}
	})
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
	teamNames.forEach(function(team) {
		if (team.project == project.id) {
			row += "<option selected value='" + team.id + "'>" + team.name + "</option>";
		} else {
			row += "<option value='" + team.id + "'>" + team.name + "</option>";
		}
	});
	row += "</select></div></div>";
	return row;
}