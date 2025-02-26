$(document).ready(function() {
	
	getUserInfo(sessionStorage['email'], sessionStorage['password']);
	$('#oldEmail').val(sessionStorage['email']);
	
	$('#updateUserBtn').on("click", function() {
		updateUserPreferences();	
	});
	
	// change password portion
	
	$('#changePasswordBtn').on("click", function() {
		$('#changePasswordModal').modal('show');
	});
	
	$('#updatePassword').on("click", function() {
		checkPassword();
	});
	
	$('#closeRetryBtn').on("click", function() {
		$('#retryPasswordModal').modal('hide');
		$('#changePasswordModal').modal('show');
	});
	
	buildAllSkillTable();
	buidlUserSkillTable();
});

function removeSkill(skillId) {

	$.ajax({
		url: "repos/removeSkillFromUser.php",
		type: "post",
		data: {
			"id": skillId
		},
		success: function() {
			buildUserSkillTable();
		}
	});
}

function addSkill(skillId) {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password	
		},
		success:function(results) {
			if (results != null) {
				var user = results[0]['id'];
				$.ajax({
					url: "repos/addSkillsForUser.php",
					type: "post",
					data: {
						"skill": skillId,
						"user": user
					},
					success: function() {
						buidlUserSkillTable();
					}
				});
			}
		}
	});
}

function buidlUserSkillTable() {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password
		},
		success:function(results) {
			var id = results[0]['id'];
			$.ajax({
				url: "repos/getSkillsForUser.php",
				type: "post",
				dataType: "json",
				data: {
					"id": id
				},
				success: function(skills) {
					$('#userSkillTable').find('tbody tr').remove();
					if (skills != null) {
						skills.forEach(function(language) {
							$('#userSkillTable').append(makeCardForUserSkill(language));
						});
					} else {
						$('#userSkillTable').append("<tr><td colspan='2'>No Data </td></tr>");
					}
				}
			});
		}
	});
}

function buildAllSkillTable() {
	$.ajax({
		url: "repos/getAllLanguages.php",
		dataType: "json",
		success: function(results) {
			$('#availableSkillTable').find('tbody tr').remove();
			if (results != null) {
				results.forEach(function(language){
					$('#availableSkillTable').append(makeCardForAvailableSKill(language));
				});
			} else {
				$('#availableSkillTable').append("<tr><td colspan='2'>No Data</td></tr>");
			}
		}
	});
}
function makeCardForUserSkill(language) {
	var row = "<tr><td style='width:85px'><button type='button' class='btn btn-danger' onclick='removeSkill(";
	row += language.id + ")'><span class='glyphicon glyphicon-minus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-title'>" + language.language + "</div></div></td></tr>";
	return row; 
}

function makeCardForAvailableSKill(language) {
	var row = "<tr><td style='width:85px'><button type='button' class='btn btn-success' onclick='addSkill(";
	row += language.id + ")'><span class='glyphicon glyphicon-plus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-title'>" + language.language + "</div></div></td></tr>";
	return row; 
}

function checkPassword() {
	var password1 = $('#password').val();
	var password2 = $('#password2').val();
	$('#changePasswordModal').modal('hide');
	if (password1 == password2) {
		var email = sessionStorage['email'];
		var password = sessionStorage['password'];
		$.ajax({
			url: "repos/updatePasswordForUser.php",
			type: "post",
			data: {
				"email": email,
				"old": password,
				"new": password2
			},
			success: function() {
				sessionStorage['password'] = password2;			
				$('#updateSuccessfulModal').modal('show');
			}
		});
	} else {
		$('#retryPasswordModal').modal('show');
	}
}

function getUserInfo(email, password) {
	$.ajax({
		url: "repos/getUser.php",
		dataType: "json",
		type: "post",
		data: {
			"email": email,
			"password": password 
		},
		success: function(results) {
			var user = results[0];
			if (user != null) {
				$('#editFirstName').val(user['first_name']);
				$('#editLastName').val(user['last_name']);
				$('#editEmail').val(user['email']);
			}
		}
	});
}

function updateUserPreferences() {
	var email = $('#oldEmail').val();
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUserId.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(results) {
			var id = results[0]['id'];
			email = $('#editEmail').val();
			var firstName = $('#editFirstName').val();
			var lastName = $('#editLastName').val();
			$.ajax({
				url: "repos/updateUserById.php",
				type: "post",
				data: {
					"id": id,
					"email": email,
					"firstName": firstName,
					"lastName": lastName
				},
				success: function() {
					sessionStorage['email'] = email;
					$('#oldEmail').val(email);
					$('#updateSuccessModal').modal('show');
				}	
			});
		}
	})
}