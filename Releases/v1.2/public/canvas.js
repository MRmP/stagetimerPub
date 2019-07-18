var currentColor = "";
function canvasClock() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth * (sizeFactor/10);
    canvas.height = window.innerHeight * (sizeFactor / 10);
    ctx = canvas.getContext("2d");

    //Background   
    ctx.fillStyle = 'rgba(0 ,0 , 00, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Params
    ctx.lineWidth = 17 * (sizeFactor / 10); //Line of Circle
    ctx.shadowBlur = ctx.lineWidth * 1.4; //Line of Circle blur

    //Colors, all them colors
    switch (incomingData.fontColor) {
        case "white":
            currentColor = normalColor;
            break;
        case "orange":
            currentColor = warnColor;
            break;
        case "red":
            currentColor = alertColor;
    }
    ctx.strokeStyle = currentColor;
    ctx.shadowColor = currentColor;
    ctx.fillStyle = currentColor;

    //Draw Arc/Circle
    ctx.beginPath();
    var archPos = degToRad(190);
    var currentSec = 0;
    switch (incomingData.mode) {
        case "tod":
            //Find current time in sec and how many % that is, convert to deg then rads
            currentSec = incomingData.time[0] * 60 * 60 + incomingData.time[1] * 60 + incomingData.time[2];
            archPos = degToRad(currentSec / 86400 * 100 * 360 / 100);
            break;
        case "countdown":
            if (incomingData.isOvertime) {
                archPos = degToRad(360);
            }
            else {
                currentSec = incomingData.time[0] * 60 * 60 + incomingData.time[1] * 60 + incomingData.time[2];
                var startTime = incomingData.startTime[0] * 60 * 60 + incomingData.startTime[1] * 60 + incomingData.startTime[2];
                archPos = degToRad(360 - currentSec / startTime * 100 * 360 / 100);
            }
            break;
        case "countup":
            //Counting up, no logical arch to be drawn
            archPos = degToRad(0);
            break;
    }

    ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.height / 2) - ctx.lineWidth, degToRad(0) - Math.PI / 2, archPos - Math.PI / 2);
   
    drawCanvasText();
    ctx.stroke();
}

var canvas_countdir = false;
function canvasBlinker() {
    if (canvas_countdir) {
        //counting up
        if (canvasAlpha < 10) {
            canvasAlpha++;
        }
        else {
            canvas_countdir = false;
            canvasAlpha--;
        }
    }
    else {
        if (canvasAlpha > 0) {
            canvasAlpha--;
        }
        else {
            canvas_countdir = true;
            canvasAlpha++;
        }
    }

    canvasClock();
    return;
}
function drawCanvasText() {
    //Display text
    ctx.shadowColor = 'transparent'; //no blur on text

    //handle overtime
    if (incomingData.isOvertime && displayOvertime) {
        var fontsize = getFont();
        ctx.font = fontsize / 2.5 + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillText("Overtime", canvas.width / 2, 120 * (sizeFactor / 10));
    }

    if (incomingData.isWarningFlash && !blinkerIsrunning) {
        interval = setInterval(canvasBlinker, 85);
        blinkerIsrunning = true;

    }
    else if (!incomingData.isWarningFlash && blinkerIsrunning) {
        //stop blinker if its running
        clearInterval(interval);
        blinkerIsrunning = false;
    }

    ctx.font = getFont() + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";

    if (blinkerIsrunning) {
        ctx.fillStyle = hexToRGBa(currentColor, canvasAlpha / 10);
    }
    else {
        ctx.fillStyle = currentColor;
    }
    clocktime = getClockTime(incomingData.time);
    ctx.fillText(clocktime, canvas.width / 2, canvas.height / 2);
}

function hexToRGBa(hex, a) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + a + ')';
    }
}
function degToRad(degree) {
    var factor = Math.PI / 180;
    return degree * factor;
}
function getFont() {
    var ratio = sizeFactor * 20 / canvas.width;
    var cSize = canvas.width * ratio;

    return (cSize | 0);
}