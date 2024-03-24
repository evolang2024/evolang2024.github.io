var showtalks=true;
var showposters=true;
function showPapers(paperList, searchTerms, searchsource) {
	if (paperList.length == 0) {
		$("#searchTitle").text("Sorry, no results were found for your search '"+searchTerms+"'");
		$("#subTitle").html("Try another search term, or <a href='browse.html'>browse through the proceedings</a>.");
	} else {
		if (searchsource == "search.html" || searchsource == "browsecheck") {
			var numresults=paperList.length.toString();
			$("#searchTitle").text(numresults+" results for '"+searchTerms+"'");
			$("#subTitle").text("Click on a result to see the full record.");
			$("#searchresults").show();
			for (var i=0;i<paperList.length;i++) {
				var paperInfo = papersData[paperList[i]];
				var typeicon = (paperInfo.prestype=="talk") ? "icon-mic2" : "icon-presentation";

				$("#paperList").append(
					$("<div>", {"id": paperList[i], "class": "paperResult probootstrap-text"}).append(
						$("<a>", {"href": paperInfo.weburl}).append(
							$("<p>", {"style": "color:black;margin-bottom:0;display:block;"}).html(
								paperInfo.title
							)
						).append(
							$("<p>", {"style": "color:grey;margin-bottom:0;font-size:0.8em;"}).text(
								paperInfo.authors.join(", ")
							)
						).append(
							$("<p>", {"class": "practicalInfo", "style": "color:#67A5C5;font-size:0.7em; margin:0;"}).append(
								$("<span>", {"id": "presIcon"}).append(
									$("<i>", {"class": typeicon})
								)
							).append(
								document.createTextNode(" ")
							).append(
								$("<span>", {"id": "presType"}).append(
									paperInfo.prestype
								)
							).append(
								document.createTextNode(" | ")
							).append(
								$("<span>").append(
									$("<i>", {"class": "icon-calendar"})
								)
							).append(
								document.createTextNode(" ")
							).append(
								$("<span>", {"id": "thedate"}).text(
									paperInfo.date
								)
							)
						).append(
							$("<p>", {"class": "practicalInfo", "style": "color:#67A5C5;font-size:0.7em; margin:0;"}).append(
								$("<span>").append(
									$("<i>", {"class": "icon-clock2"})
								)
							).append(
								document.createTextNode(" ")
							).append(
								$("<span>", {"id": "thetime"}).text(
									paperInfo.time
								)
							).append(
								document.createTextNode(" | ")
							).append(
								$("<span>").append(
									$("<i>", {"class": "icon-location"})
								)
							).append(
								document.createTextNode(" ")
							).append(
								$("<span>", {"id": "thelocation"}).text(
									paperInfo.location
								)
							)
						)
					)
				);
			}
		} else {
			var searchsplit=searchTerms.replace(" ","+")
			var newURL="search.html?search="+searchsplit
			window.location.href = newURL;
		}
	}
}

function getpapers(searchterm) {
	var relevantpapers=[];
	for (var key in papersData) {
			var paperEntry=papersData[key]
			if (paperEntry.prestype == "poster" && showposters==false) {
				//pass
			} else if (paperEntry.prestype=="talk" && showtalks==false) {
				//pass
			} else { 
			//console.log(paperEntry.keywords);
				var paptitle=paperEntry.title.toLowerCase().split(/[\s,()<>:]+/);
				for (var i=0; i<searchterm.length;i++){
					if (paptitle.includes(searchterm[i])) {
						relevantpapers.push(key);
					}
				}
				for (var j=0;j<paperEntry.keywords.length;j++) {
					if (searchterm.includes(paperEntry.keywords[j].toLowerCase())) {
						relevantpapers.push(key);
					}
				}
				for (var j=0;j<paperEntry.authors.length;j++) {
					var authFL=paperEntry.authors[j].split(" ")
					for (var aname=0;aname<authFL.length;aname++) {
						if (searchterm.includes(authFL[aname].toLowerCase())) {
							relevantpapers.push(key);
						}
					}
				}
			}
				
		}
	var uniquepapers = [];
	$.each(relevantpapers, function(i, el){
    	if($.inArray(el, uniquepapers) === -1) uniquepapers.push(el);
	});
	console.log(relevantpapers);
	console.log(uniquepapers)
	return uniquepapers;
}

$(document).ready(function() {
	$(".topics").change();
	$("section").on('click',function() {
		$(this).css("background:red")
	});

	$(".topics").change(function() {
		var searchlist=[];
		$("#paperList").html("");
		$('input:checkbox.topicbrowse').each(function () {
       		var sThisVal = (this.checked ? $(this).val() : "");
       		if (sThisVal!="") {
       			searchlist.push(sThisVal);
       		}
       		
  		});
  		if (searchlist.length>0) {
  			var relpapers=getpapers(searchlist);
       		var q=searchlist.join(" ");
       		showPapers(relpapers, q, "browsecheck");
  		}
	});
	var theurl=window.location.href;
	console.log(theurl)
	var holdparams=theurl.split("?")
	//console.log(holdparams)
	var source=holdparams[0].slice(-11,holdparams[0].length)
	var endchar=source.substr(-1);
	if (endchar=="#") {
		source=holdparams[0].slice(-12,holdparams[0].length-1)
	}
	//console.log(source)
	var params = {};
	for (var i=1; i<holdparams.length;i++) {
		console.log(holdparams[i]);
		var kpair=holdparams[i].split("=");

		params[kpair[0]]=kpair[1]
	}

	var url = new URL(window.location.href); 
	var search = url.searchParams.get("search");
	if (search != null) {
		var searchTerms = search.toLowerCase().split("+");
		var relevantpapers = getpapers(searchTerms);

		//show relevant papers
		showPapers(relevantpapers, searchTerms.join(" "), source);
		//var searchquer=septerms.join("+")
		//window.location.href = "searchresults.html?s="+searchquer
		//send user to page with list of relevant papers
	}

	$(".paperResult").click(function() {
		window.location = $(this).attr("href");
	});
});
