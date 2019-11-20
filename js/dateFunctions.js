function getWebDateFromDB(currentDate) {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var year = currentDate.getFullYear();
	var index = currentDate.getMonth();
	var month = months[index];
	var day =currentDate.getDate() + 1;
	return day + " " + month + " " + year;
}

function getDateFromString(currentDate) {
	
	var sections = currentDate.split("-");
	var year = parseInt(sections[0]);
	// assumes it is coming from DB
	var month = parseInt(sections[1]) - 1;
	var day = parseInt(sections[2]) -1;
	result = new Date(year, month, day);
	return result;
}