$(document).ready(function() {
	
	getComments();
});

function getComments() {
	$.ajax({
		url: "repos/getCommentSummary.php",
		dataType: "json",
		success: function(results) {
			$('#commentTable').find('tbody tr').remove();
			if (results != null && results.length > 0) {
				results.forEach(function(commentsummary) {
					var rowContent = makeCommentCard(commentsummary);
					var row = "<tr><td>" + rowContent + "</td><td>" + performChecking(commentsummary) +"</td></tr>";
					$('#commentTable').append(row);
				});
			} else {
				var row = "<tr><td colspan='2' class='text-center'>No Comments</td></tr>";
				$('#commentTable').append(row);
			}
		}
	});
}

function isRead(id) {
	$.ajax({
		url: "repos/hasReadComment.php",
		type: "post",
		data: {
			"id":id
		},
		success: function() {
			getComments();
		}
	});	
}

function performChecking(summary) {
	var row = "<div class='form-check'><input type='checkbox' class='form-check-input' id='commentRead' ";
	if (summary['unread'] == "1") {
		row +="checked";
	}
	row += " onclick='isRead(" + summary['id'] + ")'><label class='form-check-label' for='commentRead'>";
	row += "</label></div>";
	return row;
}

function makeCommentCard(summary) {
	if (summary['unread'] == "0") {
		return makeUnreadCommentCard(summary);
	} else {
		return makeReadCommentCard(summary);
	}
}

function makeReadCommentCard(summary) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title text-muted'>" + summary['name'] + " - " + summary['difficulty'] + ": ";
	row += summary['subject'] + "</h5>";
	row += "<h6 class='card-subtitle text-muted'><a href='mailto:" + summary['email'] + "'>";
	row += summary['first_name'] + " " + summary['last_name'] + "</a>";
	row += " - " + getWebDateFromDBString(summary['comment_date']) + "</h6>"; 
	row += "<p class='card-text text-muted'>" + summary['comment'] + "</p>";
	row += "</div></div>";
	return row;
}

function makeUnreadCommentCard(summary) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + summary['name'] + " - " + summary['difficulty'] + ": ";
	row += summary['subject'] + "</h5>";
	row += "<h6 class='card-subtitle'><a href='mailto:" + summary['email'] + "'>";
	row += summary['first_name'] + " " + summary['last_name'] + "</a>";
	row += " - " + getWebDateFromDBString(summary['comment_date']) + "</h6>"; 
	row += "<p class='card-text'>" + summary['comment'] + "</p>";
	row += "</div></div>";
	return row;
}