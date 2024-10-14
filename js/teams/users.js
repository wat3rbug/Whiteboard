$(document).ready(function () {
	buildUsersTable();	
});

function buildUsersTable() {
	$.ajax({
		url: "repos/getAllSkills.php",
		dataType: "json",
		success: function(results) {
			skills = results;
			$.ajax({
				url: "repos/getAllUsers.php",
				dataType: "json",
				success: function(users) {
					$('#usersTable').find('tbody tr').remove();
					if (users != null) {
						users.forEach(function (user) {
							var row = "<tr><td>" + makeCardFromUser(user, skills) + "</td></tr>";
							$('#usersTable').append(row);
						});				
					}
				}	
			});
		}
	});
	
}

function makeCardFromUser(user, skills) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<span class='glyphicon glyphicon-user'></span>&nbsp;";
	row += user.first_name + " " + user.last_name + "</h5>";
	filteredSkills = skills.filter(x => x.user == user['id']);
	if (filteredSkills.length != 0) {
		row += "<h6 class='card-subtitle mb-2 text-muted'>Skills: ";	
		filteredSkills.forEach(function(skill) {
			row += skill.language + " ";
		});
		row += "</h6>";
	}

	row += "<p class='card-text'></p>";
	row += "</div></div>";
	return row;
}