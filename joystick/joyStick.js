var joyStickBG = document.querySelector(".joyStickBG");
var joyStick = document.querySelector(".joyStick");

window.onload = () => {
    joyStickBG.addEventListener("touchmove",fnTouchStart);
    joyStickBG.addEventListener("touchend",fnTouchEnd);
}

function touchPos(e) {
    var parent = joyStickBG.getBoundingClientRect();
    // x & y are relative to the clicked element
    var touchX = e.touches[0].clientX - parent.left;
    var touchY = e.touches[0].clientY - parent.top;
    return {
        x:touchX,
        y:touchY
    }
};

function clickPos(e) {
    //This function determines the position of the mouse pointer on the canvas 
    var rect = joyStickBG.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    }
}

function fnTouchStart(e) {
	let eventPos = touchPos(e);
	console.log(eventPos);

    if ((eventPos.y >= joyStickBG.offsetTop && eventPos.x >= joyStickBG.offsetLeft) && (eventPos.x <= joyStickBG.offsetTop + joyStickBG.offsetHeight && eventPos.y <= joyStickBG.offsetLeft + joyStickBG.offsetWidth)) {
	   joyStick.style.left = eventPos.x;
       joyStick.style.top = eventPos.y;
    }
}

function fnTouchEnd() {
	joyStick.style.left = joyStickBG.offsetWidth/2;
    joyStick.style.top = joyStickBG.offsetHeight/2;
}