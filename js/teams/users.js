$(document).ready(function () {
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

function makeCardFromUser(user) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<span class='glyphicon glyphicon-user'></span>&nbsp;";
	row += user.first_name + " " + user.last_name + "</h5>";
	row += "<p class='card-text'></p>";
	row += "</div></div>";
	return row;
}