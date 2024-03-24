$(document).ready(function() {
	var speaker = new URL(window.location.href).searchParams.get("speaker");
	var speakerinfo = plenariesData[speaker];
	$("#speakerName").text(speakerinfo.name);
	$("#talkTitle").text(speakerinfo.title)

	speakerinfo.affiliation1.split("\n").forEach((line, i) => {
		if (i != 0) { $("#affiliation1").append($("<br>")); }
		$("#affiliation1").append(document.createTextNode(line));
	});
	speakerinfo.affiliation2.split("\n").forEach((line, i) => {
		if (i != 0) { $("#affiliation2").append($("<br>")); }
		$("#affiliation2").append(document.createTextNode(line));
	});
	$("#url").append($("<a>").attr("href", speakerinfo.url).text(speakerinfo.url));
	$("#aboutText").text(speakerinfo.about);
	$("#thedate").text(speakerinfo.date);
	$("#thetime").text(speakerinfo.time);
	$("#thelocation").text(speakerinfo.location);
	var abstractLines = speakerinfo.abstract.split("\n")
	var abstractParagraphs = [];
	for(var i = 0; i < abstractLines.length; i++){
		var line = abstractLines[i].trim();
		if (line != "")
			abstractParagraphs.push($("<p>").text(line));
	}
	$("#abstractText").html(abstractParagraphs);
	$("#siteLink").attr("href", speakerinfo.url);
	$("#spkrImg").attr("src", "img/" + speakerinfo.image);
});

