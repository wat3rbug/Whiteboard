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
					$('#remainingTasksTable').append(row);
				});
			}	
		}
	});
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