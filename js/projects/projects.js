$(document).ready(function () {
	buildProjectTable();
	
	$('#addProjectBtn').on("click", function() {
		$('#addProjectModal').modal('show');
		clearModals();
	});
	
	$('#filterBy').on("change", function() {
		sessionStorage['project_active'] = $('#filterBy').val();
		buildProjectTable();
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

function getProjectDetails(id) {
	$('#projectDetailsModal').modal('show');
	displayProjectDetails(id);
}

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
	var description = $('#addProjDescription').val();
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
			$.ajax({
				url: "repos/getProjectByDetails.php",
				type: "post",
				dataType: "json",
				data: {
					"start": start,
					"end": end,
					"name" : name,
					"description": description
				},
				success: function(result) {
					if (result != null) {
						var project = result[0];
						$('#addProjIdForLangHdn').val(project['id']);
						$('#addLanguagesModal').modal('show');
					}				
				}
			});
		}
	});
}

function pushEditToDB() {
	var id = $('#editProjIdHdn').val();
	var name = $('#editProjName').val();
	var description = $('#editProjDescription').val();
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
		url: "repos/getAllMilestones.php",
		dataType: "json",
		success: function(milestones) {
			$.ajax({
				url: "repos/getAllLanguagesForProjects.php",
				dataType: "json",
				success:function(result) {
					var langs = result;
					var active = sessionStorage['project_active'];
					if (active == null) active = 0;
					$.ajax({
						url: "repos/getProjectsByFilter.php",
						dataType: "json",
						type: "post",
						data: {
							"active": active	
						},
						success: function(results) {
							$('#projectTable').find('tbody tr').remove();
							if (results != null) {
								results.forEach(function(project){
									var row = "<tr><td>" + makeCardForProject(project, langs, milestones) + "</td>";
									row += "<td style='width:140px'>"; /* <div style='width: 65px'>"; */
									row += "<button type='button' class='btn btn-outline-warning' onClick='editProject(";
									row += project.id + ")' data-toggle='tooltip' title='Edit Project'>";
									row += "<span class='glyphicon glyphicon-pencil'></span></button>&nbsp;";
									row += "<button type='button' class='btn btn-outline-danger' onClick='removeProject(";
									row += project.id + ")' data-toggle='tooltip' title='Delete Project'>";
									row += "<span class='glyphicon glyphicon-remove'></span></button>&nbsp;";
									row += "<button type='button' class='btn btn-outline-info' onClick='getProjectDetails(";
									row += project.id + ")' data-toggle='tooltip' title='Project Details'>";
									row += "<span class='glyphicon glyphicon-list-alt'></span></button>";
									row += "&nbsp;<button type='button' class='btn btn-outline-primary' onClick='toggleProjectActive(";
									row += project.id + ")' data-toggle='tooltip' title='";
									if (project.inactive == 0) row += "Make project inactive";
									else row += "Make project active";
									row += "'><span class='glyphicon glyphicon-star";
									if (project.inactive == 0) row += "'>";
									else row += "-empty'>";
									row += "</span></button>";
									row += "</td></tr>";
									$('#projectTable').append(row);
								});
							} else {
								$('#projectTable').append("<tr><td colspan='2'>No Data</td></tr>");
							}
						}	
					});
				}
			});
		}
	});
}

function toggleProjectActive(project) {
	$.ajax({
		url: "repos/toggleProjectActive.php",
		type: "post",
		data: {
			"project": project
		},
		success: function() {
			buildProjectTable();
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

function removeAPI(project, language) {
	$.ajax({
		url: "repos/removeLangFromProject.php",
		type: "post",
		data: {
			"project": project,
			"lang": language
		},
		success: function() {
			buildProjectTable();
		}
	})
}

function makeCardForProject(project, langs, milestones) {
	var row = "<div class='card'><div class='card-body'>";
	row += "<h5 class='card-title'>" + project.name + "</h5>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>Start Date: " + getWebStrFromDB(project.start_date) + "</h6>";
	row += "<h6 class='card-subtitle mb-2 text-muted'>End Date: " + getWebStrFromDB(project.end_date) + "</h6>";
	if (langs != null) {
		let mylangs = langs.filter(a => a.project == project['id']);
		if (mylangs.length != 0) {
			row += "<h5 class='card-subtitle mb-2 text-muted'>Languages: ";	
			mylangs.forEach(function(lang) {
				row += "<button type='button' class='btn btn-outline-secondary' onclick='removeAPI(";
				row += project.id + "," + lang.id + ")'>" + lang.language;
				row += "&nbsp;<span class='glyphicon glyphicon-remove'></span></button> ";
			});
			row += "</h5>";
		}	
	}	
	if (project.description != null)
		row += "<p class='card-text'>Description: " + project.description + "</p>";
	if (milestones != null) {
		let mymilestones = milestones.filter(a => a.project == project['id']);
		if (mymilestones.length != 0) {
			mymilestones.forEach(function(milestone) {
				row += "<p class='card-text text-muted'>Milestone: " + milestone['name'] + " ";
				row += "<button type='button' class='btn btn-outline-warning' onclick='editMilestone(" + milestone['id'];
				row += ")'><span class='glyphicon glyphicon-pencil'></span></button>&nbsp;";
				row += "<button type='button' class='btn btn-outline-danger' onClick='removeMilestone(" + milestone['id'];
				row += ")'><span class='glyphicon glyphicon-remove'></span></button>";
				row += "</p>";
			});
		}
	}
	row += "</div></div>";
	return row; 
}