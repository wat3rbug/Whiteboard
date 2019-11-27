$(document).ready(function (){
	
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/LoginUser.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(result) {
			if (!isNumber(result)) {
				window.location.href("index.html");
			}
		}
	})
});

function isNumber(number) {
	return !isNaN(parseInt(number)) && isFinite(number);
}




