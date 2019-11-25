$(document).ready(function() {
	buildTaskTable();	
});

function buildTaskTable() {
	$.ajax({
		url: "repos/getAllTasks.php",
		dataType: "json",
		success: function(tasks) {
			$('#tasksTable').find('tbody tr').remove();
			if (tasks != null) {
				tasks.forEach(function(task) {
					var row = makeCardForTask(task);
					$('#tasksTable').append(row);	
				});
			}
		}	
	});
}

function makeCardForTask(task) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + task.subject + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Project: " + task.name + "</h6>";
	row += "<p class='card-text'>Description: " + task.description + "</p>";
	row += "</div></div>";
	return row;
}