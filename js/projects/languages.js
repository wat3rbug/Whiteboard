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
	
	$('#addLangBtn2').on("click", function() {
		addLanguage2();	
	});
	
	$('#pushEditLanguageToDB').on("click", function() {
		addLangsToExistingProject();
	});
	
	$('#cancelEditLanguageBtn').on("click", function() {
		$('#editLanguagesModal').modal('hide');
		$('#editProjectModal').modal('show');
	});
	
	// new project modal stuff
	
	$('#addLanguagesModal').on("shown.bs.modal", function() {
		var project = $('#addProjIdForLangHdn').val();
		getAllLanguages( $('#addLangSelector'), project);	
	});
	
	$('#cancelAddLanguageBtn').on("click", function() {
		$('#addLanguagesModal').modal('hide');
		buildProjectTable();
	});
	
	$('#pushAddLanguageToDB').on("click", function() {
		addLangsToNewProject();
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

function addLangsToNewProject() {
	$('#addLanguagesModal').modal('hide');
	var projId = $('#addProjIdForLangHdn').val();
	var langs = $('#addLangSelector').val();
	addLangsToProject(projId, langs);
}

function addLangsToExistingProject() {
	$('#editLanguagesModal').modal('hide');
	var projId = $('#editProjIdHdn').val();
	var langs = $('#langSelector').val();
	addLangsToProject(projId, langs);
	$('#editProjectModal').modal('show');
}

function addLangsToProject(projId, langs) {	
	langs.forEach(function(language) {
		$.ajax({
			url: "repos/addLangToProject.php",
			type: "post",
			data: {
				"project": projId,
				"lang": language 
			},
			success: function() {
				buildProjectTable();
			}	
		});
	});
}

function addLanguage2() {
	var language = $('#addNewLangInput').val();
	$('#addNewLangInput').val('');
	$.ajax({
		url: "repos/addLanguage.php",
		type: "post",
		data: {
			"language": language
		},
		success: function() {
			var projId = $('#editProjIdHdn').val();
			getAllLanguages($('#addLangSelector'), projId);
		}	
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

