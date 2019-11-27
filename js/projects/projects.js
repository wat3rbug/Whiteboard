$(document).ready(function () {
	buildProjectTable();
	
	$('#addProjectBtn').on("click", function() {
		$('#addProjectModal').modal('show');
		clearModals();
	});
	
	$('#addProjStart').datepicker({
		format: 'd-M-yyyy', 
		autoclose: true,
		orientation: "top auto",
		todayHighlight: true
	});
	
	$('#addProjEnd').datepicker({
		format: 'd-M-yyyy', 
		autoclose: true,
		orientation: "top auto",
		todayHighlight: true
	});
	
	$('#editProjStart').datepicker({
		format: 'd-M-yyyy', 
		autoclose: true,
		orientation: "top auto",
		todayHighlight: true
	});
	
	$('#editProjEnd').datepicker({
		format: 'd-M-yyyy', 
		autoclose: true,
		orientation: "top auto",
		todayHighlight: true
	});
	
	// Add Project Modal Section
	
	$('#pushProjectToDB').on("click", function() {
		pushProjectToDB();
		clearModals();	
	});
	
	// Edit Project Modal Section
	
	$('#pushEditProjectToDB').on("click", function() {
		pushEditToDB();
		clearModals();
	});
});

function clearModals() {
	$('#addProjName').val('');
	$('#addProjDescription').val('');
	$('#addProjStart').val('');
	$('#addProjEnd').val('');
	
	$('#editProjName').val('');
	$('#editProjDescription').val('');
	$('#editProjStart').val('');
	$('#editProjEnd').val('');
}

function pushProjectToDB() {
	var name = $('#addProjName').val();
	var description = $('#addDescription').val();
	var start = getDBDateFromJSDate($('#addProjStart').datepicker('getDate'));
	var end = getDBDateFromJSDate($('#addProjEnd').datepicker('getDate'));
	$.ajax({
		url: "repos/addProject.php",
		type: "post",
		data: {
			"start": start,
			"end": end,
			"name" : name,
			"description": description
		},
		success: function() {
			$('#addProjectModal').modal('hide');
			buildProjectTable();
		}
	});
}

function pushEditToDB() {
	var id = $('#editProjIdHdn').val();
	var name = $('#editProjName').val();
	var description = $('#editDescription').val();
	var start = getDBDateFromJSDate($('#editProjStart').datepicker('getDate'));
	var end =   getDBDateFromJSDate($('#editProjEnd').datepicker('getDate'));
	$.ajax({
		url: "repos/updateProject.php",
		type: "post",
		data: {
			"id": id,
			"start": start,
			"end": end,
			"name" : name,
			"description": description
		},
		success: function() {
			$('#editProjectModal').modal('hide');
			buildProjectTable();
		}
	});
}

function editProject(projectId) {
	if (projectId != null) {
		$.ajax({
			url: "repos/getProjectById.php",
			type: "post",
			data: {
				"id": projectId
			},
			success: function(result) {
				if (result[0] != null) {
					var project = result[0];
					$('#editProjectModal').modal('show');
					$('#editProjIdHdn').val(project['id']);
					$('#editProjName').val(project['name']);
					$('#editProjDescription').val(project['description']);
					$('#editProjStart').datepicker("setDate", getDateFromDBString(project['start_date']));
					$('#editProjEnd').datepicker("setDate", getDateFromDBString(project['end_date']));
				}
 			}
		});
	}
}

function removeProject(projectId) {
	if (projectId != null) {
		$.ajax({
			url: "repos/removeProject.php",
			type: "post",
			data: {
				"id": projectId
			},
			success: function() {
				buildProjectTable();
			}	
		});
	} 	
}

function buildProjectTable() {
	$.ajax({
		url: "repos/getAllProjects.php",
		dataType: "json",
		success: function(results) {
			$('#projectTable').find('tbody tr').remove();
			if (results != null) {
				results.forEach(function(project){
					var row = "<tr><td>" + makeCardForProject(project) + "</td>";
					row += "<td><div style='min-width: 65px'>";
					row += "<button type='button' class='btn btn-outline-warning' onclick='editProject(";
					row += project.id + ")'><span class='glyphicon glyphicon-pencil'></span></button>&nbsp;";
					row += "<button type='button' class='btn btn-outline-danger' onclick='removeProject(";
					row += project.id + ")'><span class='glyphicon glyphicon-remove'></span></button>";
					row += "</div></td></tr>";
					$('#projectTable').append(row);
				});
			}
		}	
	});
}
function getWebStrFromDB(currentDate) {
	var sections = currentDate.split("-");
	var year = sections[0];
	var day = sections[2];
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var month = months[sections[1] -1];
	return day + "-" + month + "-" + year;
		
}

function makeCardForProject(project) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + project.name + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Start Date: " + getWebStrFromDB(project.start_date) + "</h6>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>End Date: " + getWebStrFromDB(project.end_date) + "</h6>";
	if (project.description != null)
		row += "<p class='card-text'>Description: " + project.description + "</p>";
	row += "</div></div>";
	return row; 
}