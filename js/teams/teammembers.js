$(document).ready(function() {
	
	buildTeamTable();
	
	// Add Team Section
	
	$('#addTeamBtn').on("click", function() {
		$('#addTeamModal').modal('show');
		buildProjectSelectorForTeamModal();
		buildUserSelectorForTeamModal();
	});
	
	$('#pushTeamToDB').on("click", function() {
		addTeamToDB();
		$('#addTeamModal').modal('hide');
		clearAddTeamModal();
	});
});

function buildTeamTable() {

	$.ajax({
		url: "repos/getAllTeams.php",
		dataType: "json",
		success: function(result) {
			$('#teamTable').find('tbody tr').remove();
			if (result != null) {
				result.forEach(function(team) {
					// this is expensive, but traffic may be low enough to overlook it
					$.ajax({
						url: "repos/getMembersForTeam.php",
						type: "post",
						data: {
							"id": team['id']
						},
						success: function(results) {
							var users = results;
							var row = "<tr><td>" + makeTeamCard(team, users) + "</td>";
							row += "<td>" + makeButtonsForTeam(team) + "</td></tr>";
							$('#teamTable').append(row);
						}
					})
					
				});
			}	
		}	
	});
}

function makeButtonsForTeam(team) {
	var row = "<div style='min-width:65px'><button type='button' class='btn btn-outline-warning'";
	row += " onclick='editTeam(" + team['id'] + ")'><span class='glyphicon glyphicon-pencil'></span></button>";
	row += "&nbsp;<button type='button' class='btn btn-outline-danger' onclick='removeTeam(" + team['id'] + ")'>";
	row += "<span class='glyphicon glyphicon-remove'></span></button></div>";
	return row;
}

function removeTeam(id) {
	$.ajax({
		url: "repos/removeTeam.php",
		type: "post",
		data: {
			"id": id
		},
		success: function() {
			buildTeamTable();
		}
	})
}

function makeTeamCard(team, users) {
	row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + team.name + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Users:</h6>";
	if (users != null) {
		users.forEach(function(user) {
		row += "<p class='card-text'><button type='button' class='btn btn-danger' onclick='removeuserFromTeam(";
		row += user['id'] + ", " + team['id'] + ")'><span class='glyphicon glyphicon-minus-sign'></span></button>&nbsp;";
		row += user['first_name'] + " " + user['last_name'];
		row += "</p>";
		});
	}
	row += "<p class='card-text'><button type='button' class='btn btn-success' onclick='addUserModal(";
	row += team.id + ")'><span class='glyphicon glyphicon-plus'></span>&nbsp;Add User</button></p>";
	row += "</div></div>";
	return row;
}

function clearAddTeamModal() {
	$('#addTeamName').val('');
	$('#projectSelector').val(0);
}

function addTeamToDB() {
	var teamName = $('#addTeamName').val();
	var project = $('#projectSelector').val();
	$.ajax({
		url: "repos/addTeam.php",
		type: "post",
		data: {
			"teamName": teamName,
			"project": project
		},
		success: function() {
			buildProjectTable();
			buildTeamTable();
		}
	});
}

function buildProjectSelectorForTeamModal() {
	$.ajax({
		url: "repos/getProjectNameAndIds.php",
		dataType: "json",
		success: function(projects) {
			$('#projectSelector').empty();
			if (projects != null) {
				$('#projectSelector').append($('<option>').text('-- None Selected --').val('0'));
				projects.forEach(function(project) {
					$('#projectSelector').append($('<option>').text(project.name).val(project.id));	
				});
			}
		}
	})
}

function buildUserSelectorForTeamModal() {
	$.ajax({
		url: "repos/getAllUsers.php",
		dataType: "json",
		success: function(users) {
			$('#userSelector').empty();
			if (users != null) {
				users.forEach(function(user) {
					$('#userSelector').append($('<option>').text(user.first_name + " " + user.last_name).val(user.id));	
				});
			}
		}
	});
}
