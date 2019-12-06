$(document).ready(function (){
	
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUserId.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(result) {
			if (!isNumber(result)) {
				window.location.replace("index.html");
			} else {
				sessionStorage['email'] = email;
				sessionStorage['password'] = password;
				$.ajax({
					url: "repos/getUser.php",
					type: "post",
					data: {
						"email": email,
						"password": password
					},
					success: function(results) {
						if (results != null) {
							var user = results[0];
							$('#user-tab').append(" - " + user['first_name'] + " " + user['last_name']);
						} else {
							window.location.replace("index.html");
						}
					}
				})
			}
		}
	})
});

function isNumber(number) {
	return !isNaN(parseInt(number)) && isFinite(number);
}




