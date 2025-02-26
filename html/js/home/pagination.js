// $(document).ready(function() {
// 	makePageCookie(1, 10);
// });

function getPageCookie(value) {
	var result = null;
	var cookieArray = document.cookie.split(';');
	for (i = 0; i < cookieArray.length; i++) {
		var temp = cookieArray[i];
		if (temp.indexOf(value) != -1) {
			var strResult = temp.substring(temp.indexOf('=') + 1);
			result = parseInt(strResult);
		}
	}
	return result;
}

function makePageCookie(page, offset) {
	var today = new Date();
	var expire = new Date(today.getTime() + 7 * 24 * 3600 * 1000);  // 1 week
	document.cookie = "page=" + escape(page) + "; path=/; expires=" + expire.toGMTString();
	document.cookie = "offset=" + escape(offset) + "; path=/; expires=" + expire.toGMTString();
}

function makePagePills(page, offset, count, pager) {
	$('.pagination ul').empty();
	$('.pagination ul').append("<li class='page-item'><a class='page-link' href='#' tabindex='-1'>Previous</a></li>");
	if (page == 1) {
		$('.pagination ul li:first').addClass('disabled');
	}
	for (i =1; i < Math.ceil(count / offset); i++) {
		var listitem = null;
		if (page == i) {
			listitem = "<li class='page-item active'><a class='page-link' href='#' tabindex='-1'>" + i + "</a></li>";
		} else {
			listitem = "<li class='page-item'><a class='page-link' href='#' tabindex='-1'>" + i + "</a></li>";
		}
		$('.pagination ul').append(listitem);
	}
	$('.pagination ul').append("<li class='page-item'><a class='page-link' href='#' tabindex='-1'>Next</a></li>");
	if (page == Math.ceil(count /offset)) {
		$('.pagination ul li:last').addClass('disabled');
	}
}