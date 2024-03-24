$(document).ready(function() {
	sharedData.plenarySpeakers.forEach(plenarySpeaker => {
		$("#plenaries-menu").append(
			$("<li>").append(
				$("<a>", {"href": "plenary.html?speaker=" + plenarySpeaker.id}).text(plenarySpeaker.name)
			)
		);
	});
});
