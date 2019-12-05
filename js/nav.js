$(document).ready(function () {
	$('.nav-link').on("click", function() {
		var link = $(this).attr("href");
		window.location.replace(link);
	})
});