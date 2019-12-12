$(document).ready(function () {
	
	getSprintStats();
	buildBacklogTable();
	
	$('#startSprintBtn').on("click", function(){
		startNextSprint();	
	});

});

function startNextSprint() {
	$.ajax({
		url: "repos/StartNewSprint.php",
		success: function() {
			buildBacklogTable();
			getSprintStats();
		}
	});
}

function removeTask(id) {
	$.ajax({
		url: "repos/removeTaskFromSprint.php",
		type: "post",
		data: {
			"id": id
		},
		error: function(blah, blah2, blah3) {
			// not sure why adding this caused the routine to succeed
			alert(blah, blah2, blah3);	
		},
		success: function() {
			buildBacklogTable();
			getSprintStats();
		}	
	});
}

function addTask(id) {
	var sprint = $('#SprintIdHdn').val();
	$.ajax({
		url: "repos/addTaskToSprint.php",
		type: "post",
		data: {
			"id": id,
			"sprint": sprint
		},
		error: function(blah, blah2, blah3) {
			// not sure why adding this caused the routine to succeed
			alert(blah, blah2, blah3);	
		},
		success: function() {
			buildBacklogTable();
			getSprintStats();
		}	
	});
}

function getSprintStats() {
	$.ajax({
		url: "repos/getLatestSprint.php",
		dataType: "json",
		success: function(results) {
			if (results != null) {
				var sprint = results[0];
				$('#SprintIdHdn').val(sprint['id']);
				var daysLeft = getDaysLeft(sprint['start_date']);
				$.ajax({
					url: "repos/getSprintDiffCount.php",
					type: "post",
					data: {
						"id": sprint['id']
					},
					success: function(result) {
						var count = "0";
						if (result[0]['count'] != null) {
							count = result[0]['count'];
						} 
						var row = "<tr><td>" + sprint['id'] + "</td><td>" + count;
						row += "</td><td>" + daysLeft + "</td></tr>";
						$('#sprintOverall').find('tbody tr').remove();
						$('#sprintOverall').append(row);
						getSprintTable();
					}	
				});
			}
		}
	});
}

function getSprintTable() {
	var id = $('#SprintIdHdn').val();
	$.ajax({
		url: "repos/getSprintTasks.php",
		dataType: "json",
		type: "post",
		data: {
			"sprint": id
		},
		success: function(results) {
			$('#newSprintTable').find('tbody tr').remove();
			if (results != null) {				
				results.forEach(function(task) {
					var row = makeRowForSprintItem(task);
					$('#newSprintTable').append(row);
				});
			} else {
				$('#newSprintTable').append("<tr><td colspan='2'>No data</td></tr>");
			}
		}
	});
}

function buildBacklogTable() {
	$.ajax({
		url: "repos/getAllIncompleteTasks.php",
		dataType: "json",
		success: function(results) {
			$('#remainingTasksTable').find('tbody tr').remove();
			if (results != null) {	
				results.forEach(function(task) {
					var row = makeRowForTask(task);
					$('#remainingTasksTable').append(row);
				});
			} else {
				$('#remainingTasksTable').append("<tr><td colspan='2'>No data</td></tr>");
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




function makeRowForSprintItem(task) {
	var row = "<tr><td><button type='button' class='btn btn-danger' onclick='removeTask(" + task.id + ")'>";
	row += "<span class='glyphicon glyphicon-minus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title text-left'>" + task.subject +"</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted text-left'>" + task.name + "</h6>";
	row += "<h6 class='card-subtitle mb-s text-muted text-left'>Difficulty: " + task.difficulty + "</h6>";
	row += "</div></div>";
	row += "</td></tr>";
	return row;
}

function makeRowForTask(task) {
	var row = "<tr><td><button type='button' class='btn btn-success' onclick='addTask(" + task.id + ")'>";
	row += "<span class='glyphicon glyphicon-plus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title text-left'>" + task.subject +"</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted text-left'>" + task.name + "</h6>";
	row += "<h6 class='card-subtitle mb-s text-muted text-left'>Difficulty: " + task.difficulty + "</h6>";
	row += "</div></div>";
	row += "</td></tr>";
	return row;
}