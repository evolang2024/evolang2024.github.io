$(document).ready(function() {
	$(".puboptions").hide();

	var url = new URL(window.location.href); 
	var search = url.searchParams.get("search");
	var nr = url.searchParams.get("nr");

	if (search != null) {
		window.location.href = "searchresults.html?search="+search;
		//send user to page with list of relevant papers
	}
	else if (nr != null) {
		var paperInfo = papersData[nr];

		var fullcite = paperInfo.citations.copy;
		$("#fullcitation").text(fullcite);

		var authors = paperInfo.authors;
		var corresponding_emails = paperInfo.correspemails;
		var authors_html = $("#authlist");
		authors.forEach((author, i) => {
			if (i != 0 && i == authors.length - 1) {
				authors_html.append(document.createTextNode((authors.length > 2) ? ", and " : " and "));
			}
			else if (i != 0) {
				authors_html.append(document.createTextNode(", "));
			}
			authors_html.append(document.createTextNode(author));
			if (corresponding_emails[i] != null) {
				authors_html.append(document.createTextNode(" "));
				authors_html.append(
					$("<a>", {"href": "mailto:" + corresponding_emails[i], "data-toggle": "tooltip", "trigger": "hover focus click", "title": corresponding_emails[i]}).append(
						$("<span>", {"style": "color:black;font-size:15px"}).append(
							$("<i>", {"class": "icon-mail icon-sm"})
						)
					)
				);
			}
		});

		$("#tweetPaper").attr("href",paperInfo.sharing.twitter);
		$("#facebookPaper").attr("href",paperInfo.sharing.facebook);
		$("#ptitle").html(paperInfo.title);

		$("#summary").html(paperInfo.summary);

		if (paperInfo.license === undefined || paperInfo.license == null || paperInfo.license == "NONE" || paperInfo.license=="NO PUBLISH") {
			$("#nopublish").show();
			$("#dlLink").attr("href","#");
			//$("#abstractText").html("There is no summary available for this paper.");
		} else {
			$("#dlLink").attr("href", paperInfo.download);
			$("#dlLink").show();
			
			if (paperInfo.supplementaryMaterial != null) {
				$("#supplementaryMaterial").attr("href", paperInfo.supplementaryMaterial);
				$("#supplementaryMaterial").show();
			}

			//$("#doi").text("doi: "+paperInfo.doi);
			if (paperInfo.license == "CC BY-NC-ND 4.0") {
				$("#licenseNCND").show();
			}
		}

		if (paperInfo.prestype =="talk") {
			$("#presIcon").html("<i class=\"icon-mic2\"></i>");
			$("#presType").html("Talk");
		} else {
			$("#presIcon").html("<i class=\"icon-presentation\"></i>");
			$("#presType").html("Poster");
		}

		$("#thedate").html(paperInfo.date);
		$("#thetime").html(paperInfo.time);
		$("#thelocation").html(paperInfo.location);
		
		$("#ptitle").show();
		$("#bibtex").attr("href", paperInfo.citations.bibtex);
		$("#ris").attr("href", paperInfo.citations.ris);
		$("#copyCitation").attr("data-content", fullcite);

		$('[data-toggle="tooltip"]').tooltip();

		$(".loadbreak").hide();
	}
		
	$("#copyCitation").click(function() {
		const dummy = document.createElement('textarea');
		document.body.appendChild(dummy);
		dummy.value = fullcite;
		dummy.textContent = fullcite;
		var sel = getSelection();
		var range = document.createRange();
		range.selectNode(dummy);
		sel.removeAllRanges();
		sel.addRange(range);
		document.execCommand('copy');
		document.body.removeChild(dummy);
	});
});
