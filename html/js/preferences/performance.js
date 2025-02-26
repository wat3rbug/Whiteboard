$(document).ready(function() {
	
	buildPerformanceTable();
});

var MIN = 100;
var HOUR = 10000;
var DAY = 240000;

function buildPerformanceTable() {
	var email = sessionStorage['email'];
	var password = sessionStorage['password'];
	$.ajax({
		url: "repos/getUser.php",
		type: "post",
		data: {
			"email": email,
			"password": password
		},
		success: function(userResults) {
			var user = userResults[0]['id'];
			var diff = [1,2,3,5,8,13,21];
			$.ajax({
				url: "repos/getCompletedTaskTimesForUser.php",
				type: "post",
				dataType: "json",
				data: {
					"user": user
				},
				success: function(results) {
					if (results != null) {
						$('#performTable').find("tbody tr").remove();
						var maxTime = getMaxTime(results);
						diff.forEach(function(difficulty) {
							let diffResults = results.filter(x => x['difficulty'] == difficulty);
							var total = diffResults.length;
							var medianIndex = Math.round(total /2);
							var upperIndex = medianIndex + Math.round((total - medianIndex) / 2);
							var lowerIndex = Math.round(medianIndex / 2);
							var row = "<tr><td style='width:65px'>" + difficulty + "</td>";
							row += "<td><div class='progress'>";
							row += getProgressByQuarter(results[lowerIndex], maxTime, "blue");
							row += getProgressByQuarter(results[medianIndex], maxTime, "green");
							row += getProgressByQuarter(results[upperIndex], maxTime, "yellow");
							row += "</div></td></tr>";
							// row += "<td>" + results[lowerIndex]['hours'] + "</td>";
// 							row += "<td>" + results[medianIndex]['hours'] + "</td>";
// 							row += "<td>" + results[upperIndex]['hours'] + "</td>";
							$('#performTable').append(row);
						});
					}
				}
			})
		}
	});	
}

function getMaxTime(results) {
	var max = 0;
	if (results != null) {
		results.forEach(function(result){
			var current = parseInt(result['hours']);
			if (current == current && current > max) {
				max = current;
			}
		});
	}
	return max;
}

function getProgressByQuarter(number, maxRaw, style) {
	var row = "<div class='progress-bar"; 
	if (style =='green') {
		row += " bg-success'";
	} else if (style == 'info') {
		row += " bg-warning'";
	} if (style == "blue") {
		row += "' ";
	}
	var percent = 0;
	var time = 0;
	if (number != null) {
		var percent = Math.floor((parseInt(number['hours']) / maxRaw) * 100);
		var time = longToHours(parseInt(number['hours']));
	}
	row += " role='progressbar' style='width:" + percent + "%'";
	row += " aria-valuenow='" + percent + "' aria-valuemin='0' aria-valuemax='100'>" + time + " mins</div>";
	return row;
}

function longToHours(original) {
	var days = Math.floor(original / DAY);
	var daysamount = days * DAY;
	var hours = Math.floor((original - daysamount) / HOUR);
	var hoursamount = hours * HOUR;
	var mins = Math.floor((original - (daysamount + hoursamount)) / MIN);
	return  days + " day" + ((days > 1) ? "s ": " ") + hours + ":" + mins;
}

