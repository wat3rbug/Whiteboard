$(document).ready(function (){
	
	$.ajax({
		url: "login-partial.html",
		type: "get",
		success: function(data) {
			$('#sessionTimed').append(data);
			verifyUser();
			
		}
	});
			
	$('#logoutBtn').on("click", function() {
		$('#logoutModal').modal('show');
		sessionStorage['password'] = null;
		sessionStorage['email'] = null;
		$('#logoutBtnClose').on("click", function() {
			window.location.replace("index.html");	
		});

		$('#logoutModal').on("hidden.bs.modal", function() {
			window.location.replace("index.html");
		});
	});
	
	

});

function isNumber(number) {
	return !isNaN(parseInt(number)) && isFinite(number);
}

function verifyUser() {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	if (email != null && password != null) {
		$.ajax({
			url: "repos/getUser.php",
			type: "post",
			data: {
				"email": email,
				"password": password
			},
			success: function(result) {
				if (!isNumber(result[0]['id'])) {
					sessionTimeOut();
				} else {
					sessionStorage['email'] = email;
					sessionStorage['password'] = password;
					var user = result[0];
					$('#user-tab').append(" - " + user['first_name'] + " " + user['last_name']);
				}
			}
		})
	} else {
		sessionTimeOut();
	}	
}

function sessionTimeOut() {
	$('#sessionTimeOutModal').modal('show');
	
	$('#sessionBtnClose').on("click", function() {
		window.location.replace("index.html");	
	});

	$('#sessionTimeOutModal').on("hidden.bs.modal", function() {
		window.location.replace("index.html");
	});
}






