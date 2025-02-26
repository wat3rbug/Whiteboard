$(document).ready(function() {
	
	// Account Creation Section
	
 	$('#createAccount').on("click", function() {
 		clearCreateAccountModal();
 			$('#addAccountModal').modal('show');
 	});	
	
	$('#signup').on("click", function() {
		verifyUserDoesntExist();
	});
	
	// Login Section

	$('#login').on("click", function() {
		loginUser();
	});
});

function loginUser() {
	var email = $("#LoginEmail").val();
	var password = $("#LoginPassword").val();
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password
		},
		success: function(result) {
			var userid = result[0]['id'];
			if (isNumber(userid)){
				sessionStorage['email'] = email;
				sessionStorage['password'] = password;
				window.location.replace("home.html");
			} else {
				$('#accountModalFail').modal('show');
			}
		}	
	});	
}

function isNumber(number) {
	return !isNaN(parseInt(number)) && isFinite(number);
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
			$('#addAccountModal').modal('hide');
			if (result != null) {
				if (result != "0") {
					$('#accountModalFailed').modal('show');
				} else {
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
							$('#accountModalDone').modal('show');
							$('#accountSuccessDiv').text(firstName + " " + lastName + " has been added");
						}
					});
				}			
			}
		}
	});
}