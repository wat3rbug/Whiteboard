$(document).ready(function () {
		$.ajax({
			url: "repos/getUser.php",
			type: "post",
			data: {
				"email": sessionStorage['email'],
				"password": sessionStorage['password']
			},
			success: function(result) {
				var user = result[0];
				$('#user-tab').append(" - " + user['first_name'] + " " + user['last_name']);
			}
		})
});