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
});

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