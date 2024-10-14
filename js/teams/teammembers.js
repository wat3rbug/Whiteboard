$(document).ready(function() {
	
	buildTeamTable();
	
	// Add User Section
	
	$('#pushAddTeamUserToDB').on("click", function() {
		var user = $('#addUserSelector').val();
		var team = $('#addUserTeamHdn').val();
		$.ajax({
			url: "repos/addUserToTeam.php",
			type: "post",
			data: {
				"user": user,
				"team": team
			},
			success: function() {
				$('#addUserModal').modal('hide');
				clearAddUserModal();
				buildTeamTable();
			}	
		});
	});
	
	// Edit Team Section
	
	$('#pushEditTeamToDB').on("click", function() {
		pushEditToDB();
	});
	
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

function addUser(id) {
	$.ajax({
		url: "repos/getTeamById.php",
		type: "post",
		dataType: "json",
		data: {
			"id": id
		},
		success: function(results) {
			if (results != null) {
				var team = results[0];
				$.ajax({
					url: "repos/getAllUnassignedUsers.php",
					dataType: "json",
					type: "post",
					data: {
						"team": id
					},
					success: function(results2){
						if (results2 != null) {
							$('#addUserSelector').empty();
							$('#addUserModal').modal('show');
							$('#addUserTeamHdn').val(id);
							$('#addUserTeamName').val(team['name']);
							results2.forEach(function(user) {
								$('#addUserSelector').append($('<option>').text(user['first_name'] + " " + user['last_name']).val(user['id']));
							});		
						}
					}
				});
			}
		}
	});
}

function buildTeamTable() {
	$.ajax({
		url: "repos/getAllSkills.php",
		dataType: "json",
		success: function(skills) {
			$.ajax({
				url: "repos/getAllTeams.php",
				dataType: "json",
				success: function(teams) {
					$('#teamTable').find('tbody tr').remove();
					if (teams != null) {
						teams.forEach(function(team) {
							$.ajax({
								url: "repos/getMembersForTeam.php",
								type: "post",
								data: {
									"id": team['id']
								},
								success: function(users) {
									var row = "<tr><td>" + makeTeamCard(team, users, skills) + "</td>";
									row += "<td style='width:85px'>" + makeButtonsForTeam(team) + "</td></tr>";
									$('#teamTable').append(row);
								}
							})
					
						});
					}	
				}	
			});
		}	
	});
}

function makeButtonsForTeam(team) {
	var row = "<button type='button' class='btn btn-outline-warning'";
	row += " onclick='editTeam(" + team['id'] + ")'><span class='glyphicon glyphicon-pencil'></span></button>";
	row += "&nbsp;<button type='button' class='btn btn-outline-danger' onclick='removeTeam(" + team['id'] + ")'>";
	row += "<span class='glyphicon glyphicon-remove'></span></button>";
	return row;
}

function editTeam(id) {
	$.ajax({
		url: "repos/getTeamById.php",
		type: "post",
		data: {
			"id": id
		},
		success: function(results) {
			if (results != null) {
				var team = results[0];
				$('#editTeamModal').modal('show');
				$('#editTeamName').val(team.name);
				$('#editTeamHdn').val(team.id);
				$.ajax({
					url: "repos/getAllProjects.php",
					dataType: "json",
					success: function(results) {
						if (results != null) {
							results.forEach(function(project) {
								$('#editprojectSelector').append($('<option>').text(project['name']).val(project['id']));
							});
							$('#editprojectSelector').val(team['project']);
						}
					}
				})
			}
		}
	})
}

function pushEditToDB() {
	var id = $('#editTeamHdn').val();
	var name = $('#editTeamName').val();
	var project = $('#editprojectSelector').val();
	clearEditTeamModal();
	$.ajax({
		url: "repos/updateTeam.php",
		type: "post",
		data: {
			"id": id,
			"name": name,
			"project": project
		},
		success: function() {
			$('#editTeamModal').modal('hide');
			buildTeamTable();
			buildProjectTable();
		}
	});
}

function clearEditTeamModal() {
	$('#editTeamHdn').val('');
	$('#editTeamName').val('');
	$('#editprojectSelector').val(0);
}

function clearAddUserModal() {
	$('#addUserTeamHdn').val('');
	$('#addUserTeamName').val('');
	$('#addUserSelector').val(0);
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

function makeTeamCard(team, users, skills) {
	row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + team.name + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Users:</h6>";
	if (users != null) {
		users.forEach(function(user) {
		row += "<p class='card-text'><button type='button' class='btn btn-danger' onclick='removeUserFromTeam(";
		row += user['userid'] + ", " + team['id'] + ")'><span class='glyphicon glyphicon-minus-sign'></span></button>&nbsp;";
		row += user['first_name'] + " " + user['last_name'];
		row += "</p>";
		});
	}
	row += "<p class='card-text'><button type='button' class='btn btn-success' onclick='addUser(";
	row += team.id + ")'><span class='glyphicon glyphicon-plus'></span>&nbsp;";
	row += "Add User</button></p></div></div>";
	return row;
}

function removeUserFromTeam(user, team) {
	$.ajax({
		url: "repos/removeUserFromTeam.php",
		type: "post",
		data: {
			"user": user,
			"team": team
		},
		success: function() {
			buildTeamTable();
		}
	})
}

function addUserModal(id) {
	
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
