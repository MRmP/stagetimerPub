let interval = this;

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var ip = "localhost";
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
                var allText = rawFile.responseText;
                ip = allText;
            }
        }
    };
    rawFile.send(null);
    return ip;
}
triedlocalhost = false;

var ip = readTextFile("ipaddr.txt");
var ws;
var localhostToggler = false;
var fontSizeMap = ["4", "6", "8", "10", "12", "16", "20", "28", "35", "50"];

connectToWs();

var toDisplay = [true, true, true];    
var lastTick;
var overtimeStyle;
var isOvertime = false;

var overtimeSize = "";

var normalColor = "";
var warnColor = "";
var alertColor = "";
var backColor = "";

var theme = ""; //todo leave blank
var blinkerIsrunning = false;
var fontSize;
var sizeFactor;
var canvas = "";
var ctx = "";
var clocktime = "";
var canvasAlpha = 10;

var displayOvertime;
var incomingData;

function connectToWs() {
    if (!localhostToggler) {
        ws = new WebSocket("ws://localhost:1337");
    } else {
        ws = new WebSocket("ws://" + ip + ":1337");
    }
    localhostToggler = !localhostToggler;

    ws.onclose = function (error) {
        connectToWs();
    };
    ws.onopen = function (object) {
        //let stagetimer know a browser has connected
        ws.send(JSON.stringify({ 'type': 'system', 'browserConnected': true }));
    };
    

    ws.addEventListener('message', (e) => {
        let data = JSON.parse(e.data);
        //console.log(data);

        var val = "";
        var hex = "";
        switch (data.type) {
            case "configUpdate":
                switch (data.setting) {
                    case "fontSize": //todo denne endringen oppdaterer kun digitalklokk fontstørrrelse med engang, canvas må vente til neste tick, finn en måte å realtime oppdatere teksten på
                        sizeFactor = data.value;
                        fontSize = fontSizeMap[data.value - 1];
                        $('#clock').css('font-size', + fontSize + "vw");

                        overtimeSize = fontSize / 3;
                        if (overtimeSize > 6.5) {
                            overtimeSize = 6.67;
                        }
                        $('#overtime').css('font-size', overtimeSize + "vw");
                        break;
                    case "hhmmss":
                        toDisplay[0] = data.value[0];
                        toDisplay[1] = data.value[1];
                        toDisplay[2] = data.value[2];

                        break;
                    case "overtimeStyle":
                        clearInterval(interval);
                        blinkerIsrunning = false;
                        if (data.value === 6 || data.value === 7) {
                            theme = "canvas";
                            $('#clock').html("");
                            $('#overtime').html('');
                            displayOvertime = true;
                            if (data.value === 7) {
                                displayOvertime = false;
                            }
                        }
                        else {
                            theme = "digital";
                            canvas.width = 0;
                            canvas.height = 0;
                        }

                        overtimeStyle = data.value;
                        drawOvertime();
                        break;

                    case "color_background":
                        val = data.value.split(".");
                        hex = rgbToHex(parseInt(val[0]), parseInt(val[1]), parseInt(val[2]));
                        document.body.style.backgroundColor = hex;
                        backColor = hex;
                        $('.blackBorder').css('border-color', backColor);
                        break;
                    case "color_warn":
                        val = data.value.split(".");
                        hex = rgbToHex(parseInt(val[0]), parseInt(val[1]), parseInt(val[2]));
                        warnColor = hex;
                        $('#clock').css('color', warnColor);
                        break;
                    case "color_alert":
                        val = data.value.split(".");
                        hex = rgbToHex(parseInt(val[0]), parseInt(val[1]), parseInt(val[2]));
                        alertColor = hex;
                        $('#overtime').css('color', hex);
                        $('#clock').css('color', alertColor);
                        $('.redBorder').css('border-color', alertColor);
                        $('.overtimerSmall').css('border-left-color', alertColor);
                        $('.overtimerSmall').css('border-right-color', alertColor);
                        $('.overtimerSmall').css('border-top-color', alertColor);

                        $('.screenBorderSmall').css('border-left-color', alertColor);
                        $('.screenBorderSmall').css('border-right-color', alertColor);
                        $('.screenBorderSmall').css('border-bottom-color', alertColor);

                        $('.screenBorderSmalltopBorder').css('border-top-color', alertColor);
                        break;
                    case "color_hhmmss":
                        val = data.value.split(".");
                        hex = rgbToHex(parseInt(val[0]), parseInt(val[1]), parseInt(val[2]));
                        normalColor = hex;
                        $('#clock').css('color', hex);
                        break;
                }
                break;
            case "clock":
                incomingData = data;
                isOvertime = data.isOvertime;
                handleClock();
                break;
        }

    });
}

//OK 17.07.2019
function handleClock() {
    switch (theme) {
        case "digital":
            digitalClock(incomingData);
            break;
        case "canvas":
            canvasClock();
            break;
    }

}













//Helpers
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');







//OK 17.07.2019
function getClockTime(tick) {
    var h = tick[0];
    var m = tick[1];
    var s = tick[2];
    if (parseInt(h) < 10) { h = "0" + h; }
    if (parseInt(m) < 10) { m = "0" + m; }
    if (parseInt(s) < 10) { s = "0" + s; }

    if (!toDisplay[0]) {
        h = "";
    }
    else {
        if (toDisplay[1] || !toDisplay[1] && toDisplay[2]) {
            h += ":";
        }
    }
    if (!toDisplay[1]) {
        m = "";
    }
    else {
        if (toDisplay[2]) {
            m += ":";
        }
    }
    if (!toDisplay[2]) {
        s = "";
    }

    if (!isOvertime) {
        return h + m + s;
    }
    else {
        drawOvertime();
        return "-" + h + m + s;
    }
}