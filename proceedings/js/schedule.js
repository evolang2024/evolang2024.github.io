function dayPane(day) {
    return $("<div>", {"id": day.id, "class": "probootstrap-text probootstrap-animate tab-pane", "style": "width:100%;margin-right:0;"}).append(
                $("<h3>").text(
                    day.date
                )
            ).append(
                $("<br>")
            ).append(
                $("<div>", {"class": "row"}).append(
                    $("<div>", {"class": "col-md-2 col-sm-2 text-uppercase probootstrap-uppercase"}).append(
                        $("<p>").text(
                            "Time"
                        )
                    )
                ).append(
                    $("<div>", {"class": "col-md-6 col-sm-6 text-uppercase probootstrap-uppercase"}).append(
                        $("<p>").text(
                            "Event"
                        )
                    )
                ).append(
                    $("<div>", {"class": "col-md-4 col-sm-4 text-uppercase probootstrap-uppercase"}).append(
                        $("<p>").text(
                            "Location"
                        )
                    )
                )
            );
}


function eventRow(timeSlot) {
    return $("<div>", {"class": "row shadow"}).append(
                $("<div>", {"class": "col-md-2 col-sm-2"}).append(
                    $("<p>").text(
                        timeSlot.startTime + (timeSlot.endTime != null ? "-" + timeSlot.endTime : "+")
                    )
                )
            ).append(
                $("<div>", {"class": "col-md-6 col-sm-6"}).append(
                    $("<p>", {"class": "stitle"}).append(timeSlot.url != null ? 
                        $("<a>", {"href": timeSlot.url}).text(timeSlot.event) :
                        document.createTextNode(timeSlot.event)
                    )
                ).append(
                    timeSlot.extra != null ?
                    $("<p>", {"class": "text-uppercase probootstrap-uppercase"}).append(
                        $("<i>").text(
                            timeSlot.extra
                        )
                    ) :
                    $()
                )
            ).append(
                $("<div>", {"class": "col-md-4 col-sm-4"}).append(
                    $("<p>").append(
                        $("<i>").text(
                            timeSlot.venue
                        )
                    )
                )
            );
}


function talkRow(talks, slot) {
    var row = $("<div>", {"class": "row shadow"});

    row.append(
        $("<div>", {"class": "col-md-2 col-sm-2"}).append(
            $("<p>").text(
                slot.startTime + "-" + slot.endTime
            )
        )
    );
    
    slot.papers.forEach((paper, i) => {
        var paperInfo = papersData[paper];
        var track_p_xs = $("<p>", {"class": "text-uppercase probootstrap-uppercase"}).append(
                            $("<i>").text(
                                talks.tracks[i].name
                            )
                        );

        if (talks.tracks[i].extra != null) {
            track_p_xs.append(
                $("<br>")
            ).append(
                $("<i>").text(
                    talks.tracks[i].extra
                )
            );
        }

        row.append($("<div>", {"class": "col-md-2 col-sm-2", "style": "margin-bottom:10px;"}).append(
            paper ?
            $("<p>").append(
                $("<a>", {"href": paperInfo.weburl, "style":"display:block;"}).append(
                    track_p_xs
                ).append(
                    $("<p>", {"class": "stitle"}).html(
                        paperInfo.title
                    )
                ).append(
                    $("<p>", {"class": "authsub"}).text(
                        paperInfo.authors.join(", ")
                    )
                ).append(
                    paperInfo.extra != null ?
                    $("<p>", {"class": "text-uppercase probootstrap-uppercase"}).append(
                        $("<i>").text(
                            paperInfo.extra
                        )
                    ) :
                    $()
                )
            ) :
            $("<p>")
        ));
    });

    return row;
}

function talksRows(talks) {
    var header = $("<div>", {"class": "row hidden-xs"}).append(
                    $("<div>", {"class": "col-md-2 col-sm-2 text-uppercase probootstrap-uppercase"}).append(
                        $("<p>")
                    )
                 );
    talks.tracks.forEach((track) => {
        var p = $("<p>").append(
            $("<i>").text(
                track.name
            )
        );

        if (track.extra != null) {
            p.append(
                $("<br>")
            ).append(
                $("<i>").text(
                    track.extra
                )
            );
        }
        header.append(
            $("<div>", {"class": "col-md-2 col-sm-2 text-uppercase probootstrap-uppercase"}).append(
                p
            )
        );
    });
    
    var rows = $("<div>");
    rows.append(header);

    talks.slots.forEach((slot) => {
        rows.append(talkRow(talks, slot));
    });

    return rows;
}


function posterPane() {
    var div = $("<div>", {"id": "posters", "class": "probootstrap-text probootstrap-animate tab-pane", "style": "width:100%;margin-right:0;"});
    
    posterData.forEach((session) => {
        div.append(
            $("<h3>").text(
                session.name + " (" + session.date + ", " + session.startTime + "-" + session.endTime + ")"
            )
        );

        var list = $("<ul>");
        session.papers.forEach((paper) => {
            var paperInfo = papersData[paper];
            list.append(
                $("<li>").append(
                    $("<a>", {"href": paperInfo.weburl, "style":"display:block;"}).append(
                        $("<p>", {"class": "stitle"}).text(
                            paperInfo.title
                        )
                    ).append(
                        $("<p>", {"class": "authsub"}).text(
                            paperInfo.authors.join(", ")
                        )
                    )
                )
            );
        });
        div.append(list);
        
        div.append(
            $("<br>")
        );
    });
    
    return div;

    return div;
}


$(document).ready(function() {
    var extra = $("#schedule-tabs").html();
    $("#schedule-tabs").empty();

    scheduleData.forEach((day, i) => {
        $("#schedule-tabs").append(
            $("<li>", {"class": i == 0 ? "active" : ""}).append(
                $("<a>", {"href": "#" + day.id, "data-toggle": "tab"}).text(
                    day.day
                )
            )
        ).append(
            document.createTextNode(" ")
        );

        var dayDiv = dayPane(day);
        if (i == 0) { dayDiv.addClass("active"); }
        $("#schedule-content").append(dayDiv);
        day.events.forEach(timeSlot => {
            if (timeSlot.talks != null) {
                dayDiv.append(talksRows(timeSlot.talks));
            }
            else {
                dayDiv.append(eventRow(timeSlot));
            }
        });
    });

    $("#schedule-tabs").append(
        $("<li>").append(
            $("<a>", {"href": "#posters", "data-toggle": "tab"}).text(
                "Posters"
            )
        )
    );
    $("#schedule-content").append(posterPane());

    $("#schedule-tabs").append(extra);

    $("#schedule-tabs").on("click", "a[data-toggle='tab']", function(event) {
        location.hash = this.getAttribute("href");
    });

	var hash = location.hash;
    if (hash) {
        $("#schedule-tabs a[href='" + hash + "']").tab('show');
    }
    else {
        $("#schedule-tabs a:first").tab('show');
    }
});

$(window).on("hashchange", function() {
    var hash = location.hash;
    if (hash) {
        $("#schedule-tabs a[href='" + hash + "']").tab('show');
    }
});
