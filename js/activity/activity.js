
var MAX_STATE = 4;
var TODO = "0";
var WIP = "1";
var STAGED = "2";
var TESTING = "3";
var COMPLETE = "4";

$(document).ready(function() {
		
	getStats();
	buildTaskTable();
});

function changeStateForTask(selector) {
	
	// alert('got here');
	// var state  = $('#stage_' + id).val();
	// alert('id:' + id +'\tstate: ' + state);
	// $.ajax({
// 		url: "repos/changeStateForTask.php",
// 		type: "post",
// 		data: {
// 			"id": id,
// 			"state": state
// 		},
// 		success: function() {
// 			getStats();
// 			buildTaskTable();
// 		}
// 	});
}

function buildTaskTable() {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getOrderedTasksForUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": email,
			"password": password
		},
		success: function(results) {
			if (results != null) {
				var max = getBiggestRowCount(results);
				buildEmptyTable(max);
				fillTableWithTasks(results, max);
				
			} else {
				var row = "<tr><td colspan='5'>No Data</td></tr>";
				$('#sprintTable').append(row);
			}
		}	
	});
}

function fillTableWithTasks(tasks, max) {
	
	var complete, testing, staged, wip, todo = 0;
	for (i = 0; i < tasks.length; i++) {
		switch (tasks[i]['state']) {
		case TODO :
			$('#td_' + todo + "_0").html(makeTaskCard(tasks[i]));
			todo++;
			break;
		case WIP:
			$('#td_' + todo + "_1").html(makeTaskCard(tasks[i]));
			wip++;
			break;
		case STAGED:
			$('#td_' + todo + "_2").html(makeTaskCard(tasks[i]));
			staged++;
			break;
		case TESTING:
			$('#td_' + todo + "_3").html(makeTaskCard(tasks[i]));
			testing++;
			break;
		case COMPLETE:
			$('#td_' + todo + "_4").html(makeTaskCard(tasks[i]));
			complete++;
			break;
		}
		var ider = "#stage_" + tasks[i]['id'];
		var id = tasks[i]['id'];
		$(ider).bind("change", changeStateForTask(id));
	}
}

function buildEmptyTable(max) {
	$('#sprintTable').find('tbody tr').remove();
	for (i =0; i < max; i++) {
		var row = "<tr>";
		for (j = 0; j <= MAX_STATE; j++) {
			row += "<td id='td_" + i + "_" + j +"'>&nbsp;</td>";
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
				var pointsCompleted = parseInt(results['total']) - parseInt(results['points_left']);
				var row = "<tr><td>" + results['sprintid'] + "</td>";
				row += "<td>" + results['total'] + "</td>";
				row += "<td>" + pointsCompleted + "</td>";
				row += "<td>" + results['points_left'] + "</td>";
				row += "<td>" + getDaysLeft(results['start_date']) + "</td></tr>";
				$('#sprintStatsTable').append(row);
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
	var row = "<div class='card'><div class='card-body>";
	row += "<h5 class='card-title'>" + task['subject'] + "</h5>";
	row += "<h6 class='card-subtitle'>" + task['name'] +" </h6>";
	row += "<p class='card-text'>" + task['difficulty'] + makeOptionListForCard(task['id']) + "</p>";
	row += "<p class='card-text'><button type='button' ";
	row += "onclick='getDetails(" + task['id'] + ")' class='btn btn-link'>Details";
	row += "</button>&nbsp;<button type='button' class='btn btn-outline-primary' onClick='commentTask(" + task['id'];
	row += ")'><span class='glyphicon glyphicon-plus'></span>&nbsp;Add Comment</button></p>";
	row += "</div></div>";
	return row;
}

function makeOptionListForCard(id) {
	var row = "<div style='max-width:150px'><select class='browser-default custom-select' id='stage_" + id + "'>";
	var options = ["To Do", "Work In Progress", "Staged", "Testing", "Completed"];
	var count = 0;
	options.forEach(function(option) {
		row += "<option value='" + count++ +"'>" + option + "</option>";
	});
	row += "</select></div>";
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
				$('#taskDetailsModal').modal('show');
				$('#detailProject').text(results['name']);
				$('#detailDifficulty').text(results['difficulty']);			
				$('#detailSubject').text(results['subject']);
				$('#detailDescription').text(results['description']);
				var type = null;
				switch (results['type']) {
					case "0": type = "Story";
					break;
					case "1": type = "Bug";
					break;
					case "2": type ="Task";
					break;
				}
				$('#detailType').val(type);
			}
		}	
	});
}