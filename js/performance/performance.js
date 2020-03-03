$(document).ready(function() {

	$.ajax({
		url: "repos/getTotalSprintCount.php",
		dataType: "json",
		success: function(results) {
			if (results.length == 3 && results != null) {
				$('#sprints').text(results[0]['count']);
				$('#totals').text(results[1]['count']);
				$('#totalComplete').text(results[2]['count']);
			}
		}
	});
	
	$.ajax({
		url: "repos/getAllSprintProjectSummary.php",
		dataType: "json",
		success: function(results) {
			if (results != null && results.length > 0) {
				$('#sprintTable').find('tbody tr').remove();
				results.forEach(function(sprintProjSum) {
					var row = "<tr><td>" + sprintProjSum['sprint'] + "</td><td>" + sprintProjSum['name'] + "</td>";
					row += "<td>" + sprintProjSum['name'] + "</td>";
					row += "<td>&nbsp;</td><td>&nbsp;</td></tr>";
					$('#sprintTable').append(row);
				});
			}
		}
	});
});