//constants/elements
const parent = document.querySelector(".parent");
const scoreDisplay = document.querySelector(".score");
const zoneDivs = document.querySelectorAll(".zone");
const btn = document.querySelector(".btn");
const divNo = 25;
//Audios
const audio = document.getElementById("myAudio");
const bgAudio = document.getElementById("myAudio3");
const gameOverAudio = document.getElementById("myAudio2");
//Vars
var sliders,divBelow,scoreInterval;
var gameOver = false;
var score = 0;
var speed = 3;	
var current = 0;	

window.onload = () => {
	let sliderDivs;
	//Creating Divs
	for (let i = 0; i < divNo; i++) {
		sliderDivs = document.createElement("div");		
		sliderDivs.setAttribute("class","block b" + i);
		zoneDivs[0].before(sliderDivs);

		sliderDivs.style.bottom = i*sliderDivs.offsetHeight;
	}

	scoreInterval = setInterval(() => {
		scoreDisplay.innerHTML = "SCORE" + "<br>" + score; 
	},60);

	setInterval(() => {
		if(btn.innerHTML == "STOP")  {
			if (gameOver == false) {bgAudio.play();}
			else {
				bgAudio.pause();
				gameOverAudio.play();
			}
		}
	},60);
}

function fnVisible() {
	if(gameOver == false) {
		sliders[current].style.visibility = "visible";
		fnRAF(fnVisible);
	}
}

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
	btn.addEventListener("touchstart",fnStart);
}else {
    btn.addEventListener("click",fnStart);
}


function fnStart() {
	fnCutOff();
	if (gameOver == false) {audio.play();}
	sliders = document.querySelectorAll(".block");	

	if (btn.innerHTML == "START") {
		fnVisible();//Calling visible loop function.THIS is the same as raf(visible);
		btn.style.fontSize = 20 + "px";
		btn.innerHTML = "STOP";
		fnRAF(fnSlide);	
	}
	else if (btn.innerHTML == "STOP") {
		if(current == 24 && gameOver == false) {
			let random = fnRandomNumber(0, (parent.offsetWidth - parent.style.borderWidth) - sliders[0].offsetWidth);	

			for (let i = 0; i < divNo; i++) {
				sliders[i].style.width = sliders[current].offsetWidth;
				sliders[i].style.visibility = "hidden";
				sliders[i].style.left = random + "px";
			}

			for (let i = 0; i < zoneDivs.length; i++) {
				zoneDivs[i].innerHTML = "ZONES " + (i+3);
			}			
			current = 0;
		} else {			
			current += 1;
			score += 1;
			sliders[current].style.left = sliders[current].offsetLeft + "px";
		}
	}
}

function fnSlide() {	
	let borderWidth = parseInt(getComputedStyle(parent).borderRightWidth.slice(0, -2));
	//console.log(borderWidth);
	if(sliders[current].offsetWidth <= 0 && gameOver == false) {fnGameOver();}

	for (let i = current; i < divNo; i++) {		
		if(sliders[i].offsetLeft + sliders[i].offsetWidth >= (parent.offsetWidth - borderWidth*2)) {
			speed = -2;
		}
		else if(sliders[i].offsetLeft <= 0) {
			speed = +2;
		}
		if(gameOver == false) {
			sliders[i].style.left = (sliders[i].offsetLeft + speed) + "px";
		}
	}
	
	fnRAF(fnSlide);
}

function fnCutOff() {
	if (current >= 1) {
		divBelow = current - 1;
		if(sliders[current].offsetLeft + sliders[current].offsetWidth < sliders[divBelow].offsetLeft || sliders[current].offsetLeft > sliders[divBelow].offsetLeft + sliders[current].offsetWidth) {
			fnGameOver();
		}

		if (gameOver == false) {
			if(sliders[current].offsetLeft + sliders[current].offsetWidth < sliders[divBelow].offsetLeft + sliders[divBelow].offsetWidth) {
				//left side
				let differenceOfLefts = sliders[divBelow].offsetLeft - sliders[current].offsetLeft;//difference

				sliders[current].style.left = sliders[divBelow].offsetLeft;

				for(let i = current; i < divNo; i++) {
					sliders[i].style.width = sliders[i].offsetWidth - differenceOfLefts;
				}
			}
			else if(sliders[current].offsetLeft > sliders[divBelow].offsetLeft) {//right side
				let differenceOfRights =  (sliders[current].offsetLeft + sliders[divBelow].offsetWidth) - (sliders[divBelow].offsetLeft + sliders[divBelow].offsetWidth);//difference

				sliders[current].style.left = sliders[divBelow].offsetLeft;

				for(let i = current; i < divNo; i++) {
					sliders[i].style.width = sliders[i].offsetWidth - differenceOfRights;
				}
				sliders[current].style.left = (sliders[divBelow].offsetLeft + sliders[divBelow].offsetWidth) - sliders[current].offsetWidth;
			}
		}
	}
}

function fnGameOver() {
	clearInterval(scoreInterval);
	gameOver = true;	
	btn.remove();

	for (let i = 0; i < zoneDivs.length; i++) {
		zoneDivs[i].style.marginLeft = 0 + "px";
	}
	
	zoneDivs[0].innerHTML = "";

	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        zoneDivs[1].innerHTML = "<p style='text-align:center;'>" + "TOUCH TO RESTART" + "</p>";
    }else {
        zoneDivs[1].innerHTML = "<p style='text-align:center;'>" + "PRESS ANY KEY TO RESTART" + "</p>";
    }

	zoneDivs[2].style.top = 5 + "px";
	zoneDivs[2].style.left = 5 + "px";
	zoneDivs[2].style.fontSize = 30 + "px";
	zoneDivs[2].innerHTML = "GAME" + "<br>" + "OVER";

	window.addEventListener("keydown",() => {
		setTimeout(() => {location.reload();},1000/5);
	});
	window.addEventListener("touchstart",() => {
		setTimeout(() => {location.reload();},1000/5);
	});
}

function fnRAF(func) {
	requestAnimationFrame(func);
}

function fnRandomNumber(min, max) {  
	// Function to generate random number 
	return Math.round(Math.random() * (max - min) + min); 
}