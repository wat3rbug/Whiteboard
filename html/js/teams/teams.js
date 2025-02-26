$(document).ready(function () {

	buildTeamTable();

	$('#pushTeamToDB').on("click", function() {
		addTeamToDB();
	});
});

function addTeamToDB() {
	var teamName = $('#addTeamName').val();
	var project = $('#projectSelector').val();
	var user = $('#userSelector').val();
	$.ajax({
		url: "repos/addTeam.php",
		type: "post",
		data: {
			"teamName" : teamName,
			"project": project,
			"user": user
		},
		success: function() {
			$('#addTeamModal').modal('hide');
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
		url: "repos/getAllTeams.php",
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

function makeCardFromTeam(team, users) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + team.name + "</h5>";
	row += "<p class='card-text'><button type='button' class='btn btn-success' onclick='addUserToteam(" + team.id + ")'>";
	row += "<span class='glyphicon glyphicon-plus'></span></button>";
	row += "<select class='browser-default custom-select' id='teamMateSelector_" + team.id + "'>";
	row += "</select></div></div>";
	return row;
}
