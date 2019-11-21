$(document).ready(function () {

	verifyUser();
	buildProjectTable();
	buildTeamTable();
	buildUsersTable();
});

function buildUsersTable() {
	$.ajax({
		url: "repos/getAllUsers.php",
		dataType: "json",
		success: function(users) {
			$('#usersTable').find('tbody tr').remove();
			if (users != null) {
				users.forEach(function (user) {
					var row = "<tr><td>" + makeCardFromUser(user) + "</td></tr>";
					$('#usersTable').append(row);
				})				
			}
		}	
	});
}

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

function makeCardFromUser(user) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<span class='glyphicon glyphicon-user'></span>&nbsp;";
	row += user.first_name + " " + user.last_name + "</h5>";
	row += "<p class='card-text'></p>";
	row += "</div></div>";
	return row;
}

function makeCardFromTeam(team, users) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + team.name + "</h5>";
	row += "<p class='card-text'><button type='button' class='btn btn-success' onclick='addUserToteam(" + team.id + ")'>";
	row += "<span class='glyphicon glyphicon-plus'></span></button>";
	row += "<select class='browser-default custom-select' id='teamMateSelector_" + team.id + "'>";
	row += "</select></div></div>";
	return row;
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