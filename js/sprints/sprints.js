$(document).ready(function () {
	
	getSprintStats();
	buildBacklogTable();
	buildFilter();
	
	$('#startSprintBtn').on("click", function(){
		$('#nextSprintModal').modal('show');
	});
	
	$('#filterBy').change(function() {
		buildFilteredBacklogTable();	
	});
	
	$('#filterTasksBy').change(function() {
		getFilteredSprintTable();	
	});
	
	$('#closeBtn').on("click", function() {
		$('#nextSprintModal').modal('hide');
		startNextSprint();
	})

});

function buildFilteredBacklogTable() {
	var id = $('#filterBy').val();
	$.ajax({
		url: "repos/getFilteredIncompleteTasks.php",
		type: "post",
		dataType: "json",
		data: {
			"id": id
		},
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
	})
}

function buildFilter() {
	$.ajax({
		url: "repos/getAllProjects.php",
		dataType: "json",
		success: function(results) {
			$('#filterBy').empty();
			$('#filterTasksBy').empty();
			$('#filterBy').append($('<option>').text(' -- All projects --').val("0"));
			$('#filterTasksBy').append($('<option>').text(' -- All projects --').val("0"));
			if (results != null) {
				results.forEach(function(project) {
					$('#filterBy').append($('<option>').text(project['name']).val(project['id']));
					$('#filterTasksBy').append($('<option>').text(project['name']).val(project['id']));
				});		
			}
		}
	});
}

function startNextSprint() {
	$.ajax({
		url: "repos/startNewSprint.php",
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
			var sprint = {'id': "0", 'start_date': getStringDateForToday() };
			if (results != null && results.length != 0) {
				sprint = results[0];
			}
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
					if (result != null && result.length  > 0 && result[0]['count'] != null) {
						count = result[0]['count'];
					} 
					$('#sprintOverall').find('tbody tr').remove();
					var row = "<tr><td>" + sprint['id'] + "</td><td>" + count;
					row += "</td><td>" + daysLeft + "</td></tr>";					
					$('#sprintOverall').append(row);
					getSprintTable();
				}	
			});
		}
	});
}

function getFilteredSprintTable() {
	var filter = $('#filterTasksBy').val();
	var id = $('#SprintIdHdn').val();
	$.ajax({
		url: "repos/getFilteredSprintTasks.php",
		dataType: "json",
		type: "post",
		data: {
			"sprint": id,
			"filter": filter
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
	})
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
	var row = "<tr><td style='width:65px'><button type='button' class='btn btn-danger' onclick='removeTask(" + task.id + ")'>";
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
	var row = "<tr><td style='width:65px'><button type='button' class='btn btn-success' onclick='addTask(" + task.id + ")'>";
	row += "<span class='glyphicon glyphicon-plus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title text-left'>" + task.subject +"</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted text-left'>" + task.name + "</h6>";
	row += "<h6 class='card-subtitle mb-s text-muted text-left'>Difficulty: " + task.difficulty + "</h6>";
	row += "</div></div>";
	row += "</td></tr>";
	return row;
}