$(document).ready(function() {

	$('#editLangsBtn').on("click", function() {
		$('#editProjectModal').modal('hide');
		var projId = $('#editProjIdHdn').val();
		$('#editProjIdForLangHdn').val(projId);
		$('#editLanguagesModal').modal('show');
		getAllLanguages($('#langSelector'), projId);
	});	
	
	$('#addLangBtn').on("click", function() {
		addLanguage();	
	});
	
	$('#pushEditLanguageToDB').on("click", function() {
		addLangsToProject();
	});
	
	$('#cancelEditLanguageBtn').on("click", function() {
		$('#editLanguagesModal').modal('hide');
		$('#editProjectModal').modal('show');
	});
});

function getAllLanguages(selector, project) {
	$.ajax({
		url: "repos/getAllLanguages.php",
		type: "post",
		success: function(results) {
			selector.empty();
			if (results != null) {				
				results.forEach(function(lang) {
					selector.append($('<option>').text(lang.language).val(lang.id));
				});	
				$.ajax({
					url: "repos/getLangsForProject.php",
					data: {
						"project": project
					},
					dataType: "json",
					type: "post",
					success: function(results) {
						if (results != null) {
							let langs = results.map(a => a.id);
							selector.val(langs);

						}
					}
				})
			} 
		}
	});
}

function addLangsToProject() {
	$('#editLanguagesModal').modal('hide');
	var projId = $('#editProjIdHdn').val();
	var langs = $('#langSelector').val();
	$('#editProjectModal').modal('show');
	langs.forEach(function(language) {
		$.ajax({
			url: "repos/addLangToProject.php",
			type: "post",
			data: {
				"project": projId,
				"lang": language 
			}	
		});
	});
}

function addLanguage() {
	var language = $('#newLangInput').val();
	$('#newLangInput').val('');
	$.ajax({
		url: "repos/addLanguage.php",
		type: "post",
		data: {
			"language": language
		},
		success: function() {
			var projId = $('#editProjIdHdn').val();
			getAllLanguages($('#langSelector'), projId);
		}	
	});
}

