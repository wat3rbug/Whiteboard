$(document).ready(function() {
	buildTaskTable();	
	
	$("#addTaskBtn").on("click", function() {
		$('#addTaskModal').modal('show');
		clearAddTaskModal();
		getProjectsForAddTask();	
	});
	
	$('#cancelAddTaskBtn').on("click", function() {
		$('#addTaskModal').modal('hide');
	});
	
	$('#pushTaskToDB').on("click", function() {
		addTaskToDB();
	});
	
	// Edit Task Section
	
	$('#cancelEditTaskBtn').on("click", function() {
		$('#editTaskModal').modal('hide');
	});
	
	$('#pushEditTaskToDB').on("click", function() {
		pushEditToDB();
	});
	
	$('#filterBy').change(function() {
		sessionStorage['filter'] = $('#filterBy').val();
		buildTaskTable();
	});
});

function clearAddTaskModal() {
	$('#addSubject').val('');
	$('#addDescription').val('');
}

function pushEditToDB() {
	var id = $('#taskIdHdn').val();
	var subject = $('#editSubject').val();
	var description = $('#editDescription').val();
	var diff = $('#editDiffSelector').val();
	var project = $('#editProjSelector').val();
	var type = $('#editTaskTypeSelector').val();
	$.ajax({
		url: "repos/updateTask.php",
		type: "post",
		data: {
			"id": id,
			"subject": subject,
			"description": description,
			"diff": diff,
			"project": project,
			"type": type,
		},
		success: function() {
			$('#editTaskModal').modal('hide');
			buildTaskTable();
		}	
	});
}

function editTask(taskId) {
	getProjectsForTask($('#editProjSelector'));
	$.ajax({
		url: "repos/getTaskById.php",
		type: "post",
		data: {
			"id": taskId
		},
		success: function(result) {
			$('#taskIdHdn').val(taskId);
			if (result != null) {
				var task = result[0];
				$('#editSubject').val(task.subject);
				$('#editDescription').val(task.description);
				$('#editDiffSelector').val(task.difficulty);
				$('#editProjSelector').val(task.project);
				$("#editTaskTypeSelector").val(task.type);
				$('#editTaskModal').modal('show');
			}
		}
	});
}

function removeTask(taskId) {
	$.ajax({
		url: "repos/removeTask.php",
		type: "post",
		data: {
			"id": taskId
		},
		success: function() {
			buildTaskTable();
		}
	});
}

function addTaskToDB() {
	var project = $('#addProjSelector').val();
	var subject = $('#addSubject').val();
	var description = $('#addDescription').val();
	var difficulty = $('#addDiffSelector').val();
	var type = $('#addTaskTypeSelector').val();
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		dataType: "json",
		data: {
			"email": sessionStorage['email'],
			"password": sessionStorage['password']
		},
		success: function(result) {
			if (result != null) {
				var user = result[0]['id'];
				$.ajax({
					url: "repos/addTask.php",
					type: "post",
					data: {
						"project": project,
						"user": user,
						"description" : description,
						"subject": subject,
						"diff": difficulty,
						"type": type,
					},
					success: function() {
						buildTaskTable();
						$('#addTaskModal').modal('hide');
					}	
				});
			}
		}
	});
}
function getProjectsForAddTask() {
	$.ajax({
		url: "repos/getProjectNameAndIds.php",
		dataType: "json",
		success: function(results) {
			$('#addProjSelector').empty();
			if (results != null) {
				results.forEach(function(project){
					$('#addProjSelector').append($('<option>').text(project.name).val(project.id));
				});
			}
		}
	});
}

function getProjectsForTask(selector) {
	$.ajax({
		url: "repos/getProjectNameAndIds.php",
		dataType: "json",
		success: function(results) {
			selector.empty();
			if (results != null) {
				selector.append($('<option>').text(' -- All Projects --').val('0'));
				results.forEach(function(project){
					selector.append($('<option>').text(project.name).val(project.id));
				});
				if (sessionStorage['filter'] != null) {
					selector.val(sessionStorage['filter']);
				}
			}
		}
	});
}

function buildTaskTable() {
	var filter = sessionStorage['filter'];
	if (filter == null) {
		filter = 0;
	}
	$.ajax({
		url: "repos/getAllTasks.php",
		type: "post",
		data: {
			"filter": filter
		},
		dataType: "json",
		success: function(tasks) {
			$('#tasksTable').find('tbody tr').remove();
			if (tasks == null || tasks.length == 0) {
				$('#tasksTable').append("<tr><td colspan='2' class='text-center'>No Data</td></tr>");
			} else {
				tasks.forEach(function(task) {
					var row = "<tr><td class='" + task.name +"'> " + makeCardForTask(task) + "</td><td class='";
					row += task.name + "' style='width:85px'>";
					row += "<button type='button' class='btn btn-outline-warning' onclick='editTask(" + task.id + ")'>";
					row += "<span class='glyphicon glyphicon-pencil'></span></button>&nbsp;";
					row += "<button type='button' class='btn btn-outline-danger' onclick='removeTask(" + task.id + ")'>";
					row += "<span class='glyphicon glyphicon-remove'></span></button>";
					row += "</td></tr>";
					$('#tasksTable').append(row);	
				});
			}
			getProjectsForTask($('#filterBy'));
		}	
	});
}

function makeCardForTask(task) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + task.subject + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Difficulty: " + task.difficulty + "</h6>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Project: " + task.name + "</h6>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Type: ";
	switch (task.type) {
		case "0": row += "Story";
		break;
		case "1": row += "Task";
		break;
		case "2": row += "Bug";
		break;
	}
	row += "</h6><p class='card-text'>Description: " + task.description + "</p>";
	row += "</div></div>";
	return row;
}

function wrapRow(text) {
	var length = text.length;
}