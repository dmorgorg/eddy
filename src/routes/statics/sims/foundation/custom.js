$(document).ready(function () {
    "use strict";
    // a 2D array, an array of question arrays, each having elements for each button in that question/section

    var buttons = [],
        panels = [];
    // this just applies unique ids to the buttons and the panels,
    // based on the section id
    $("li.example").each(function () {
        // only proceed if the section is a question
        if ((this.id)[0] === 'q') {
            // the question id stripped of its leading 'q'
            var qid = this.id.substr(1),
                // the number of buttons and panels in this question
                bLen,
                pLen;
            // find all children buttons and panels of this question
            buttons[qid] = $(this).find('button');
            panels[qid] = $(this).find('.panel');
            bLen = buttons[qid].length;
            pLen = panels[qid].length;

            if (bLen !== pLen) {
                alert("Error: button and panel mismatch");
                return;
            }

            for (var i = 0; i < bLen; i++) {
                // each question will have three buttons: btn1_0, btn1_1 and btn1_2
                $(buttons[qid][i]).attr('id', "btn" + qid + "_" + i);

                // add properties to the button

                //  (buttons[qid][i]).open = $(buttons[qid][i]).data("open");
                //  (buttons[qid][i]).shut = $(buttons[qid][i]).data("shut");
                $(buttons[qid][i]).html($(buttons[qid][i]).data("open"));
                // unique id for the associated panel
                $(panels[qid][i]).attr("id", "panel" + qid + "_" + i);
                $(panels[qid][i]).data('visible', false);
            }
        }
        //console.log(buttons);
    });

    $("button").click(function (e) {
        //console.log(this.id);
        // strip 'btn' from the id
        var i = (this.id).substring(3);


        var under = i.indexOf('_');
        // console.log(under);
        var question = i.substring(0, under);
        var nthButton = i.substring(under + 1);
        // console.log(nthButton);
        var panel = "#panel" + question + "_" + nthButton;
        //        console.log($(buttons[question][nthButton]).shut);
        //        console.log($(panel).attr("id"));


        if ($(panels[question][nthButton]).data("visible")) {
            console.log("visible")
            $(panel).slideUp(500);
            $(this).html($(buttons[question][nthButton]).data("open"));
            $(this).blur();
            $(panels[question][nthButton]).data("visible", false);
        } else {
            $(panel).slideDown(500);
            $(this).html($(buttons[question][nthButton]).data("shut"));
            $(this).blur();
            $(panels[question][nthButton]).data("visible", true);
        }
        //  (panels[question][nthButton]).visible = !(panels[question][nthButton]).visible

    });

});