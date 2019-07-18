function digitalClock(data) {
    if (data.fontColor === "white") {
        $('#clock').css('color', normalColor);
        $('.screenBorderSmall').css('border-top-color', backColor);
        $('.blackBorder').css('border-color', backColor);
    }
    else if (data.fontColor === "orange") {
        $('#clock').css('color', warnColor);
    }
    else if (data.fontColor === "red") {
        $('#clock').css('color', alertColor);
        $('.redBorder').css('border-color', alertColor);
        $('.overtimerSmall').css('border-left-color', alertColor);
        $('.overtimerSmall').css('border-right-color', alertColor);
        $('.overtimerSmall').css('border-top-color', alertColor);

        $('.screenBorderSmall').css('border-left-color', alertColor);
        $('.screenBorderSmall').css('border-right-color', alertColor);
        $('.screenBorderSmall').css('border-bottom-color', alertColor);

        $('.screenBorderSmalltopBorder').css('border-top-color', alertColor);
    }

    //This could probably be a check if intervall has a value and not a blinkerIsrunning variable
    if (data.isWarningFlash && !blinkerIsrunning) {
        interval = setInterval(blinker, 1500);
        blinkerIsrunning = true;
        //run blinker
    }
    else if (!data.isWarningFlash && blinkerIsrunning) {
        //stop blinker if its running
        clearInterval(interval);
        blinkerIsrunning = false;
    }

    if (!data.isOvertime) {
        $('#overtime').html('');
        drawNoOvertime();
    }

    $('#clock').html(getClockTime(data.time));
}
function blinker() {
    $('.clockBlink').fadeOut(650);
    $('.clockBlink').fadeIn(650);
}
function drawOvertime() {
    if (!isOvertime || theme === "canvas") {
        drawNoOvertime();
        return;
    }

    switch (overtimeStyle) {
        case 0:
            //Big Box
            //Overtime
            $('#screenBorder').addClass("screenBorderLarge");
            $('#screenPosition').addClass("redBorder");
            $('#overtime').addClass("overtimeLarge");
            $('#clock').addClass("clockCenter");
            $('#overtime').html('Overtime');

            //Remove other
            $('#screenBorder').removeClass("screenBorderSmalltopBorder");
            $('#overtime').removeClass("overtimerSmall");
            $('#screenPosition').removeClass("blackBorder");
            $('#screenBorder').removeClass("screenBorderSmall");
            $('#clock').removeClass("clockSmall");
            break;

        case 1:
            //Big Box
            //No Overtime text
            $('#screenBorder').addClass("screenBorderLarge");
            $('#screenPosition').addClass("redBorder");
            $('#clock').addClass("clockCenter");
            $('#overtime').html('');


            //Remove other
            $('#screenBorder').removeClass("screenBorderSmalltopBorder");
            $('#overtime').removeClass("overtimerSmall");
            $('#screenBorder').removeClass("screenBorderNone");
            $('#overtime').removeClass("overtimeLarge");
            $('#screenPosition').removeClass("blackBorder");
            $('#screenBorder').removeClass("screenBorderSmall");
            $('#clock').removeClass("clockSmall");
            break;

        case 2:
            //Overtime
            //Samllbox
            $('#clock').addClass("clockSmall");
            $('#overtime').addClass("overtimerSmall");
            $('.overtimerSmall').css('border-left-color', alertColor);
            $('.overtimerSmall').css('border-right-color', alertColor);
            $('.overtimerSmall').css('border-top-color', alertColor);
            $('#screenBorder').addClass("screenBorderSmall");
            $('.screenBorderSmall').css('border-left-color', alertColor);
            $('.screenBorderSmall').css('border-right-color', alertColor);
            $('.screenBorderSmall').css('border-bottom-color', alertColor);
            $('#screenPosition').addClass("blackBorder");
            $('.screenBorderSmall').css('border-top-color', backColor);
            $('.blackBorder').css('border-color', backColor);
            $('#overtime').html('Overtime');

            $('#screenBorder').removeClass("screenBorderSmalltopBorder");
            $('#screenPosition').removeClass("redBorder");
            $('#screenBorder').removeClass("screenBorderLarge");
            $('#clock').removeClass("clockCenter");
            $('#overtime').removeClass("overtimeLarge");
            break;
        case 3: //Current
            //Small box
            //No Overtime
            $('#screenBorder').addClass("screenBorderSmalltopBorder");
            $('.screenBorderSmalltopBorder').css('border-top-color', alertColor);
            $('#screenBorder').addClass("screenBorderSmall");
            $('.screenBorderSmall').css('border-left-color', alertColor);
            $('.screenBorderSmall').css('border-right-color', alertColor);
            $('.screenBorderSmall').css('border-bottom-color', alertColor);
            $('#clock').addClass("clockSmall");
            $('#screenPosition').addClass("blackBorder");
            $('.blackBorder').css('border-color', backColor);
            $('#overtime').addClass("overtimeLarge");
            $('#overtime').html('');

            //Remove other
            $('#overtime').removeClass("overtimerSmall");
            $('#screenPosition').removeClass("redBorder");
            $('#screenBorder').removeClass("screenBorderLarge");
            $('#clock').removeClass("clockCenter");
            break;

        case 4:
            //No Box
            //No Overtime
            $('#screenBorder').addClass("screenBorderLarge");
            $('#screenPosition').addClass("blackBorder");
            $('.blackBorder').css('border-color', backColor);
            $('#overtime').addClass("overtimeLarge");
            $('#overtime').html('');
            $('#clock').addClass("clockCenter");
            $('#clock').removeClass("clockSmall");

            //Remove other
            $('#screenBorder').removeClass("screenBorderSmalltopBorder");
            $('#overtime').removeClass("overtimerSmall");
            $('#screenPosition').removeClass("redBorder");
            $('#screenBorder').removeClass("screenBorderSmall");
            break;

        case 5:
            //No Box
            //Overtime text
            $('#screenBorder').addClass("screenBorderLarge");
            $('#screenPosition').addClass("blackBorder");
            $('.blackBorder').css('border-color', backColor);
            $('#overtime').addClass("overtimeLarge");
            $('#overtime').html('Overtime');
            $('#clock').addClass("clockCenter");
            $('#clock').removeClass("clockSmall");

            //Remove other

            $('#screenBorder').removeClass("screenBorderSmalltopBorder");
            $('#overtime').removeClass("overtimerSmall");
            $('#screenPosition').removeClass("redBorder");
            $('#screenBorder').removeClass("screenBorderSmall");
            break;

        default:
            drawNoOvertime();
            break;
    }
}

function drawNoOvertime() {
    $('#screenBorder').addClass("screenBorderLarge");
    $('#screenPosition').addClass("blackBorder");
    $('.blackBorder').css('border-color', backColor);
    $('#overtime').addClass("overtimeLarge");
    $('#overtime').html('');
    $('#clock').addClass("clockCenter");
    $('#clock').removeClass("clockSmall");

    //Remove other
    $('#screenBorder').removeClass("screenBorderSmalltopBorder");
    $('#overtime').removeClass("overtimerSmall");
    $('#screenPosition').removeClass("redBorder");
    $('#screenBorder').removeClass("screenBorderSmall");
}