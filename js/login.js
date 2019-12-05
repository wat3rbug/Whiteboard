$(document).ready(function (){
	
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/loginUser.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(result) {
			if (!isNumber(result[0]['id'])) {
				window.location.href("index.html");
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
							window.location.href("index.html");
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




