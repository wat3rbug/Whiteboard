
var MAX_STATE = 4;
var TODO = "0";
var WIP = "1";
var STAGED = "2";
var TESTING = "3";
var COMPLETE = "4";

$(document).ready(function() {
		
	getStats();
	buildTaskTable();
	
	$('#filterBy').change(function() {
		sessionStorage['filter'] = $('#filterBy').val();
		buildTaskTable();
	});
	
	$('#sprintBtnClose').on("click", function() {
		window.location.replace("sprints.html");
	});
});

function changeStateForTask(id) {
	
	var state  = $('#changer_' + id).val();
	$.ajax({
		url: "repos/changeTaskState.php",
		type: "post",
		data: {
			"id": id,
			"state": state
		},
		success: function() {
			getStats();
			buildTaskTable();
		}
	})

}

function buildTaskTable() {
	var filter = sessionStorage['filter'];
	if (filter == null) {
		filter = 0;
	}
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getOrderedTasksForUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password,
			"filter": filter
		},
		success: function(results) {
			$('#sprintTable').find('tbody tr').remove();
			if (results != null) {
				var max = getBiggestRowCount(results);
				buildEmptyTable(max);
				fillTableWithTasks(results, max);		
			} else {
				var row = "<tr><td colspan='5'>No Data</td></tr>";
				$('#sprintTable').append(row);
			}
			getProjectsForTask();
		}	
	});
}

function fillTableWithTasks(tasks, max) {
	
	var complete = 0;
	var testing = 0;
	var staged = 0;
	var wip = 0;
	var todo = 0;
	for (i = 0; i < tasks.length; i++) {
		switch (tasks[i]['state']) {
		case TODO :
			$('#td_' + todo + "_0").html(makeTaskCard(tasks[i]));
			$('#changer' + tasks[i]['id']).val("0");
			todo++;
			break;
		case WIP:
			$('#td_' + wip + "_1").html(makeTaskCard(tasks[i]));
			$('#changer_' + tasks[i]['id']).val("1");
			wip++;
			break;
		case STAGED:
			$('#td_' + staged + "_2").html(makeTaskCard(tasks[i]));
			$('#changer_' + tasks[i]['id']).val("2");
			staged++;
			break;
		case TESTING:
			$('#td_' + testing + "_3").html(makeTaskCard(tasks[i]));
			$('#changer_' + tasks[i]['id']).val("3");
			testing++;
			break;
		case COMPLETE:
			$('#td_' + complete + "_4").html(makeTaskCard(tasks[i]));
			$('#changer_' + tasks[i]['id']).val("4");
			complete++;
			break;
		}
	}
}

function buildEmptyTable(max) {
	$('#sprintTable').find('tbody tr').remove();
	for (i =0; i < max; i++) {
		var row = "<tr>";
		for (j = 0; j <= MAX_STATE; j++) {
			row += "<td style='width: 20%' id='td_" + i + "_" + j +"'>&nbsp;</td>";
		}
		row += "</tr>";
		$('#sprintTable').append(row);
	}
}
function getBiggestRowCount(tasks) {
	var highest = 0;
	var count = 0;
	for (i = 0; i <= MAX_STATE; i++) {
		count = getCountForState(tasks, i);
		if (count > highest) highest = count;
		count = 0;
	}
	return highest;
}

function getCountForState(tasks, state) {
	var count = 0;
	tasks.forEach(function(task) {
		if (parseInt(task['state']) == state) count++;
	});
	return count; 
}

function getStats() {
	$.ajax({
		url: "repos/getSprintStatsByUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": sessionStorage['email'],
			"password": sessionStorage['password']
		},
		success: function(results) {
			if (results != null) {
				var daysLeft = getDaysLeft(results['start_date']);
				var pointsCompleted = parseInt(results['total']) - parseInt(results['points_left']);
				var row = "<tr><td>" + results['sprintid'] + "</td>";
				row += "<td>" + results['total'] + "</td>";
				row += "<td>" + pointsCompleted + "</td>";
				row += "<td>" + results['points_left'] + "</td>";
				row += "<td>" + daysLeft + "</td></tr>";
				$('#sprintStatsTable').find('tbody tr').remove();
				$('#sprintStatsTable').append(row);
				if (daysLeft < 1 || daysLeft > 14) {
					openOldSprintModal();
				}
			}
		}
	});
}

function getDaysLeft(startDate) {
	var sections = startDate.split('-');
	var year = sections[0];
	var month = sections[1] - 1;
	var day = sections[2];
	var start = new Date(year, month, day);
	var currentDate = new Date();
	var left = 14 - (currentDate.getDate() - start.getDate());
	return left;
}

function makeTaskCard(task) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + task['difficulty'] + " - "+ task['subject'] + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>" + task['name'] +" </h6>";
	row += "<p class='card-text'>" + makeOptionListForCard(task['id']) + "</p>";
	if (task['state'] == 4) {
		if (task['milestone'] == null) {
			row += "<p class='card-text'><button type='button' class='btn btn-outline-success' onclick='makeMileStone(";
			row += task['id'] + ")'><span class='glyphicon glyphicon-flag'></span>&nbsp;Make Milestone</button></p>";
		} else {
			row += "<p class='card-text'><b>Milestone:</b> " + task['milestone'] + "</p>";
		}
	}
	row += "<p class='card-text'><button type='button' class='btn btn-primary' onClick='commentTask(";
	row += task['id'] + ")'><span class='glyphicon glyphicon-plus'></span>&nbsp;Add Comment</button>&nbsp;"
	row += "<button onclick='getDetails(" + task['id'] + ")' class='btn btn-outline-primary'>";
	row += "<span class='glyphicon glyphicon-list-alt'></span>&nbsp;Details</button>&nbsp;";
	if (task['comment_count'] == 1) row += "1 comment";
	else row += task['comment_count'] + " comments";
	row += "</p>";	
	row += "</div></div>";
	return row;
}

function makeOptionListForCard(id, state) {
	var row = "<select class='browser-default custom-select' ";
	row += "onchange='changeStateForTask(" + id + ")' id='changer_" + id + "'>";
	var options = ["To Do", "Work In Progress", "Staged", "Testing", "Completed"];
	var count = 0;
	options.forEach(function(option) {
		row += "<option value='" + count++ +"'>" + option + "</option>";
	});
	row += "</select>";
	return row;
}

function getDetails(id) {
	$.ajax({
		url: "repos/getTaskDetailsById.php",
		type: "post",
		dataType: "json",
		data: {
			"id": id
		},
		success: function(results) {
			if (results != null) {
				var task = results[0];
				$('#taskDetailsModal').modal('show');
				$('#detailProject').text(task['name']);
				$('#detailDifficulty').text(task['difficulty']);			
				$('#detailSubject').text(task['subject']);
				$('#detailDescription').text(task['description']);
				emptyPriorComments($('#viewCommentTable'));
				var type = null;
				switch (task['state']) {
					case "0": type = "Story";
					break;
					case "1": type = "Bug";
					break;
					case "2": type ="Task";
					break;
				}
				$('#detailType').text(type);
				$.ajax({
					url: "repos/viewPriorComments.php",
					type: "post",
					dataType: "json",
					data: {
						"id": id
					},
					success: function(comments) {
						if (comments != null) {
							viewPriorComments($('#viewCommentTable'), comments);					
						} 
					}
				})
			}
		}	
	});
}

function getProjectsForTask() {
	$.ajax({
		url: "repos/getProjectNameAndIds.php",
		dataType: "json",
		success: function(results) {
			$('#filterBy').empty();
			if (results != null) {
				$('#filterBy').append($('<option>').text(' -- All Projects --').val('0'));
				results.forEach(function(project) {
					$('#filterBy').append($('<option>').text(project.name).val(project.id));	
				});
				if (sessionStorage['filter'] != null) {
					$('#filterBy').val(sessionStorage['filter']);
				}
			}
		}
	})
}

function openOldSprintModal() {
	$('#oldSprintModal').modal('show');
}