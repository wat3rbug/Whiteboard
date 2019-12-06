$(document).ready(function () {
	buildBacklogTable();
});

function buildBacklogTable() {
	$.ajax({
		url: "repos/getAllIncompleteTasks.php",
		type:"get",
		dataType: "json",
		success: function(results) {
			if (results != null) {
				$('#remainingTasksTable').find('tbody tr').remove();
				results.forEach(function(task) {
					var row = makeRowForTask(task);
					$('#remaingTasksTable').append(row);
				});
			}	
		}
	});
}

function makeRowForTask(task) {
	var row = "<tr><td><button type='button' class='btn btn-success' onclick='addTask(" + task.id + ")'>";
	row += "<span class='glyphicon glyphicon-plus-sign'></span></button></td><td>";
	row += "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + task.subject +"</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>" + task.name + "</h6>";
	row += "<p class='card-text'>Difficulty: " + task.difficulty + "</p>";
	row += "</div></div>";
	row += "</td></tr>";
	return row;
}