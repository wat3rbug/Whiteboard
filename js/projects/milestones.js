function editMilestone(id) {
	
	$.ajax({
		url: "repos/getMilestoneById.php",
		type: "post",
		dataType: "json",
		data: {
			"id":id
		},
		success: function(results) {
			if (results != null && results.length > 0) {
				$('#editMilestoneModal').modal('show');
				results.forEach(function(milestone) {
					$('#editMilestoneName').val(milestone['name']);
					$('#editMilestoneHdn').val(id);
				});
			}
		}
	})
}

function removeMilestone(id) {
	$.ajax({
		url: "repos/removeMilestone.php",
		type: "post",
		data: {
			"id": id
		},
		success: function() {
			buildProjectTable();
		}
	})
}

$(document).ready(function() {

	$('#cancelEditMilestoneBtn').on("click", function() {
		$('#editMilestoneModal').modal('hide');
	});
	
	$('#pushEditMilestoneToDB').on("click", function() {
		var milestone = $('#editMilestoneName').val();
		var id = $('#editMilestoneHdn').val();
		$.ajax({
			url: "repos/editMilestone.php",
			type: "post",
			data: {
				"id": id,
				"name": milestone
			},
			success: function(result) {
				$('#editMilestoneModal').modal('hide');
				buildProjectTable();
			}	
		});
	});	
});