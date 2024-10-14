$(document).ready(function() {
	
});

function displayProjectDetails(id) {
	$.ajax({
		url: "repos/getMilestonesForProject.php",
		type : "post",
		dataType: "json",
		data: {
			"id": id
		},
		success: function(milestoneResults) {
			$.ajax({
				url: "repos/getProjectById.php",
				type: "post",
				dataType: "json",
				data: {
					"id": id
				},
				success: function(results) {
					if (results != null && results.length > 0) {
						results.forEach(function(project) {
							$('#projectDetailsName').text(project['name']);
							$('#projectDetailsStart').text(getWebDateFromDBString(project['start_date']));
							$('#projectDetailsEnd').text(getWebDateFromDBString(project['end_date']));
							$('#projectDetailsDescription').text(project['description']);
						});
						$.ajax({
							url: "repos/getLanguagesByProject.php",
							type: "post",
							dataType: "json",
							data: {
								"id": id
							},
							success: function(langResults) {
								$('#projectLanguages').empty();
								if (langResults != null && langResults.length > 0) {						
									langResults.forEach(function(lang) {
										$('#projectLanguages').append(lang['language'] + " ");
									});
								} else {
									$('#projectLanguages').append('none');
								}
								$.ajax({
									url: "repos/getTasksForProject.php",
									type: "post",
									dataType: "json",
									data: {
										"id": id
									},
									success: function(taskResults) {
										$('#projectTasks').find("tbody tr").remove();
										if (taskResults != null && taskResults.length > 0) {
											taskResults.forEach(function(task) {
												var row = null;
												if (task['completed'] == null) {
													row = "<tr><td><button type='button' class='btn btn-outline-danger' ";
													row += "data-toggle='tooltip' title='Incomplete'>";
													row +="<span class='glyphicon glyphicon-minus'></span></button></td>";
												}
												if (task['completed'] == "1") {
													let thismilestone = milestoneResults.filter(x => x.task == task['id']);
													if (thismilestone.length > 0) {
														row = "<tr><td><button type='button' class='btn btn-outline-warning' ";
														row += "data-toggle='tooltip' title='Milestone'>";
														row += "<span class='glyphicon glyphicon-flag'></span></button></td>";
													} else {
														row = "<tr><td><button type='button' class='btn btn-outline-success' ";
														row += "data-toggle='tooltip' title='Completed'>";
														row += "<span class='glyphicon glyphicon-ok'></span></button></td>";
													}
												}
												row += "<td>" + task['id'] + "</td><td>" + task['subject'] + "</td></tr>";
												$('#projectTasks').append(row);
											});
										} else {
											$('#projectTasks').append("<tr><td colspan='3' class='text-center'>No Tasks</td></tr>");
										}
									}	
								});
							}	
						});
					}
				}
			});
		}	
	});
}