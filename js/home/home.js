$(document).ready(function() {
	
	getComments();
	
	$('.page-link').on('click', function() {
		var page = $(this).text();
		makePageCookie(page, getPageCookie("offset"));
		getComments();
	});
});

function getComments() {
	var page = null;
	var pagecount = 5;
	if ((page = getPageCookie("page")) == null) {
		page = 1;
		pagecount = 5;
		makePageCookie(page, pagecount);
	} else {
		pagecount = getPageCookie("offset");
	}
	//alert("page: " + page + "\noffset: " + pagecount);
	
	$.ajax({
		url: "repos/getCommentSummaryCount.php",
		dataType: "json",
		success: function(count) {
			if (count != null) {
				var start = (page -1) * pagecount;
				var end = (page * pagecount) - 1;
				var results = count[0]['count'];
				makePagePills(page, pagecount, results, "pagination");
				
				$('#resultsSection').text(start + " to " + end + " of " + results + " results");
			}
			$.ajax({
				url: "repos/getCommentSummaryByPage.php",
				dataType: "json",
				type: "post",
				data: {
					"page": page,
					"count": pagecount
				},
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
	})
	
}

function buildNavPills(page, pagecount, count) {
	for(i = 1; i < Math.ceil(count / pagecount); i++) {
		var temp = $('li');
		var href = "#" + i;
		//temp.add('a').href(href);
		if (page == i) {
			temp.addClass('.active');
		} 
		$('.pagination').add(temp);
	}
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