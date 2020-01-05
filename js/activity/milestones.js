$(document).ready(function() {

	$('#addMilestoneBtn').on("click", function() {
		addMilestone();
	});	
});

function addMilestone() {
	var project = $('#projIdHdn').val();
	var task = $('#milestoneTaskIdHdn').val();
	var name = $('#milestoneName').val();
	$.ajax({
		url: "repos/addMilestone.php",
		type: "post",
		data: {
			"project": project,
			"task": task,
			"name": name
		}, success: function() {
			buildTaskTable();
			$('#addMilestoneModal').modal('hide');
		}	
	});
}

function makeMileStone(id) {
	var task = id;
	$.ajax({
		url: "repos/getProjectByTask.php",
		type: "post",
		dataType: "json",
		data: {
			"id": id
		},
		success: function(results) {
			if (results != null) {
				$('#projIdHdn').val(results[0]['id']);
				$('#milestoneProjName').text(results[0]['name']);
				$('#milestoneTaskIdHdn').val(id);
				$('#addMilestoneModal').modal('show');
				$('#milestoneName').val('');
			}
		}
	});
}