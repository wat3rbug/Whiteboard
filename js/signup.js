$(document).ready(function (){
	
 	$('#createAccount').on("click", function() {
 		clearCreateAccountModal();
 			$('#addAccountModal').modal('show');
 	});
	
	$('#signup').on("click", function() {
		verifyUserDoesntExist();
	});
	
	$('#cancelSignup').on("click", function() {
		$('#addAccountModal').modal('hide');
	});
	
	$('#finished').on("click", function() {
		$('#accountModalDone').modal('hide');	
	});
	
	$('#login').on("click", function() {
		loginUser();
	});
});

function loginUser() {
	var email = $("#LoginEmail").val();
	var password = $("#LoginPassword").val();
	if (false) {
		// check to make sure these are actually filled out
	} else {
	$.ajax({
		url: "repos/LoginUser.php",
		type: "post",
		data: {
			"email:": email,
			"password": password
		},
		success: function(result) {
			if (result != null){
				sessionStorage['email'] = email;
				sessionStorage['password'] = password;
				window.location.replace("whiteboard.com/teams.html");
			} else {
				$('#accountModalFail').modal('show');
			}
		}	
	});	
	}
}

function clearCreateAccountModal() {
	$('#firstName').val('');
	$('#lastName').val('');
	$('#EmailInput').val('');
	$('#Password').val('');
}

function verifyUserDoesntExist() {
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var email = $('#EmailInput').val();
	var password = $('#Password').val();
	$.ajax({
		url: "repos/verifyUserIsNew.php",
		type: "post",
		data: {
			"firstName": firstName,
			"lastName": lastName,
			"email": email
		},
		success: function(result) {
			if (result != null) {
				if (result == 0) {
					$.ajax({
						url: "repos/addNewUser.php",
						type: "post",
						data: {
							"firstName": firstName,
							"lastName": lastName,
							"email": email,
							"password": password
						},
						success: function() {
							$('#addAccountModal').modal('hide');
							$('#accountModalDone').modal('show');
							$('#accountSuccessDiv').text(firstName + " " + lastName + " has been added");
						}
					})
				} else {
					// do a highlight or something here
				}
			}
		}
	});
}