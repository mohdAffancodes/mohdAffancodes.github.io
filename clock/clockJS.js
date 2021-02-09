const clock = document.querySelector(".clock");
const hands = document.querySelector(".hand");
var myTimeDisplay;
var divs, alignDivs;

fnTimeDisplay();
fnClockTimeDisplay();

window.onload = function () {
    for (let i = 1, j = 30; i < 13, j <= 360; i++, j += 30) {
        divs = document.createElement("div");
        divs.setAttribute("class", "number number" + i);
        divs.style.transform = "rotate(" + j + "deg)";
        hands.before(divs);

        alignDivs = document.createElement("div");
        alignDivs.setAttribute("class", "align" + i);
        alignDivs.style.transform = "rotate(" + -j + "deg)";
        alignDivs.style.fontSize = 40 + "px";
        alignDivs.innerHTML = i;
        divs.appendChild(alignDivs);
    }
};

function fnTimeDisplay() {
    myTimeDisplay = new Date();
    const para = document.querySelector(".time");

    if (
        myTimeDisplay.getSeconds() < 10 &&
        myTimeDisplay.getMinutes() < 10 &&
        myTimeDisplay.getHours() < 10
    ) {
        //AllThree
        para.innerHTML =
            "0" +
            myTimeDisplay.getHours() +
            ":0" +
            myTimeDisplay.getMinutes() +
            ":0" +
            myTimeDisplay.getSeconds();
    } else if (
        myTimeDisplay.getSeconds() < 10 &&
        myTimeDisplay.getMinutes() < 10
    ) {
        //min and sec
        para.innerHTML =
            myTimeDisplay.getHours() +
            ":0" +
            myTimeDisplay.getMinutes() +
            ":0" +
            myTimeDisplay.getSeconds();
    } else if (myTimeDisplay.getSeconds() < 10) {
        //sec
        para.innerHTML =
            myTimeDisplay.getHours() +
            ":" +
            myTimeDisplay.getMinutes() +
            ":0" +
            myTimeDisplay.getSeconds();
    } else if (myTimeDisplay.getMinutes() < 10) {
        //min
        para.innerHTML =
            myTimeDisplay.getHours() +
            ":0" +
            myTimeDisplay.getMinutes() +
            ":" +
            myTimeDisplay.getSeconds();
    } else if (myTimeDisplay.getHours() < 10) {
        //min
        para.innerHTML =
            "0" +
            myTimeDisplay.getHours() +
            ":" +
            myTimeDisplay.getMinutes() +
            ":" +
            myTimeDisplay.getSeconds();
    } else {
        para.innerHTML =
            myTimeDisplay.getHours() +
            ":" +
            myTimeDisplay.getMinutes() +
            ":" +
            myTimeDisplay.getSeconds();
    }
    fnRAF(fnTimeDisplay);
}

function fnClockTimeDisplay() {
    myTimeDisplay = new Date();
    const shand = document.querySelector(".shand");
    const mhand = document.querySelector(".mhand");
    const hhand = document.querySelector(".hhand");

    shand.style.transform =
        "translateX(-50%) rotate(" + myTimeDisplay.getSeconds() * 6 + "deg)";

    mhand.style.transform =
        "translateX(-50%) rotate(" + myTimeDisplay.getMinutes() * 6 + "deg)";

    hhand.style.transform =
        "translateX(-50%) rotate(" +
        (myTimeDisplay.getHours() * 30 + myTimeDisplay.getMinutes() / 2) +
        "deg)";

    fnRAF(fnClockTimeDisplay);
}

function fnRAF(func) {
    requestAnimationFrame(func);
}
