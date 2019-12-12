// get contents from sql
// do count for each column
// make table with max rows based on highest column count
// <td id='td_row_col'>
// make table based on number of rows and columns
// use$('#td_'+ row + '_' + col).html(the cell info you need);

$(document).ready(function() {
	
	getStats();
});

function getStats() {
	$.ajax({
		url: "repos/getLatestSprint.php",
		dataType: "json",
		type: "post",
		success: function(result) {
			var sprint = result[0];
			if (sprint != null) {
				var id = sprint['id'];
				var daysLeft = getDaysLeft(sprint['start_date']);
				$.ajax({
					url: "repos/getPointsForSprint.php",
					type: "post",
					dataType: "json",
					data: {
						"id": id
					},
					success: function(result) {
						if (result != null) {
							var total = 0;
							var left = 0;
							if (result[0] != null) total = result[0];
						 	if (result[1] != null) left = result[1];
							var completed = total - left;
							$('#sprintStatsTable').find('tbody tr').remove();
							var row = "<tr><td>" + id + "</td><td>" + total;
							row += "</td><td>" + completed + "</td><td>" + left;
							row += "</td><td>" + daysLeft + "</td></tr>";
							$('#sprintStatsTable').append(row);
						}
					}
				})
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