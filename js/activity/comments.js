$(document).ready(function() {
	
	$('#addCommentBtn').on("click", function() {
		addComment();
	});
});

function commentTask(id) {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password
		},
		success: function(results) {
			if (results != null){
				var user = results[0];
				var userid = user['id'];
				$('#commentUserIdHdn').val(userid);
				$('#commentUser').text(user['first_name'] + " " + user['last_name']);
				$.ajax({
					url: "repos/getTaskById.php",
					type: "post",
					dataType: "json",
					data: {
						"id": id
					},
					success: function(results2) {
						if (results2 != null) {
							var task = results2[0];
							$('#commentTask').text(task['subject']);
							$('#commentTaskIdHdn').val(task['id']);
							$('#comment').val('');
							$.ajax({
								url: "repos/viewPriorComments.php",
								type: "post",
								dataType: "json",
								data: {
									"id": id
								},
								success: function(results3) {
									if (results3 != null) {
										viewPriorComments($('#commentTable'), results3);
									} else {
										emptyPriorComments($('#commentTable'));
									}
									$('#addCommentModal').modal('show');
								} 
							});					
						}			
					}
				});
			}			
		}
	});
}

function emptyPriorComments(table) {
	table.find('tbody tr').remove();
	var row = "<tr><td colspan='3' class='text-center'>No Comments</td></tr>";
	table.append(row);
}

function viewPriorComments(table, comments) {
	table.find('tbody tr').remove();
	comments.forEach(function(comment) {
		var row = "<tr class='comment-modal-row'><td><a href='mailto:" + comment['email'] + "'>";
		row += comment['first_name'] + " " + comment['last_name'] + "</a></td>";
		row += "<td>" + getWebDateFromDBString(comment['comment_date']) + "</td>";
		row += "<td>" + comment['comment'] + "</td></tr>";
		table.append(row);
	});
}

function addComment() {
	var taskid = $('#commentTaskIdHdn').val();
	var userid = $('#commentUserIdHdn').val();
	var comment = $('#comment').val();
	$.ajax({
		url: "repos/addComment.php",
		type: "post",
		data: {
			"task": taskid,
			"user": userid,
			"comment": comment
		}, 
		success: function() {
			$('#addCommentModal').modal('hide');
			$('#commentTaskIdHdn').val('');
			$('#commentUserIdHdn').val('');
			$('#comment').val('');
			buildTaskTable();
		}
	});
}