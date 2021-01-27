var score = 0;
var p,ball,border;
var block,b2,b3,b4;
var gap,g2,g3,g4;
var blockSpeed = 1.5 + 0.375;
var ballSpeed = 2 + 0.375;
var blockArray,gapArray;
const FPS = 80;
var down = false,down2 = false,down3 = false,down4 = false;
var downArray = [down,down2,down3,down4];
var stuckInLeft = false,stuckInRight = false;
var interval;
var blur = false;
var shrunk = false;

var sound = document.getElementById("myAudio");
var collide = document.getElementById("myAudio4");
var audioInterval;

window.addEventListener("click",(evt) => {

	document.getElementById("hide").style.visibility = "hidden";
	//Getting Elements
	p = document.getElementById("p");
	ball = document.getElementById("ball");
	//drawing blocks	
	blocks();
	//border div
	borderDiv();
	//ball div
	ball.style.backgroundColor = "red";
	ball.style.left = 0 + "px";
	ball.style.top = 0 + "px";
	//starting game
	raf(() => {
		game();
		gameOver();
	});

	audioInterval = setInterval(() => {
		sound.play();
	},1000/5);

	window.addEventListener("keydown",keyPush);
	window.addEventListener("keyup",keyUp);
	//Pause on blur
	window.addEventListener('blur',(evt) =>  {
		blur = true;
		sound.pause();
		clearInterval(audioInterval);
	});
	//Resume on focus
	window.addEventListener('focus',(evt) => {
		blur = false;
		if(shrunk == false) {
			audioInterval = setInterval(() => {
				sound.play();
			},1000/60);		
		}
	});
},{once:true})

function blocks() {
	blockArray = [block,b2,b3,b4];
	gapArray = [gap,g2,g3,g4];
	let id = [1,2,3,4];
	//Creating Divs
	for (let i = 0; i < blockArray.length; i++) {
		blockArray[i] = document.createElement("div");		
		blockArray[i].setAttribute("class","block");
		blockArray[i].setAttribute("id","b" + id[i]);
		ball.before(blockArray[i]);

		gapArray[i] = document.createElement("div");
		gapArray[i].setAttribute("class","gap");
		gapArray[i].setAttribute("id","g" + id[i]);
		ball.before(gapArray[i]);
	}
	//block1
	block = document.getElementById("b1");
	gap = document.getElementById("g1");
	//Block2
	b2 = document.getElementById("b2");
	g2 = document.getElementById("g2");	
	//Block3
	b3 = document.getElementById("b3");
	g3 = document.getElementById("g3");
	//Block4
	b4 = document.getElementById("b4");
	g4 = document.getElementById("g4");

	//block div
	block.style.backgroundColor = "black";
	block.style.top = (p.offsetHeight/2) + "px";
	//block div
	for (let i = 0,b = 1; i < blockArray.length,b < blockArray.length; i++,b++) {
		blockArray[b].style.backgroundColor = "white";
		blockArray[b].style.top = (blockArray[i].offsetTop + blockArray[i].offsetHeight) + 100 + "px";
	}
	//Gap divs
	for (var i = 0; i < blockArray.length; i++) {
		gapArray[i].style.top = blockArray[i].style.top;
		gapArray[i].style.width = randomNumber(60,100) + "px";
		gapArray[i].style.left = randomNumber(0, (p.offsetWidth - gapArray[i].offsetWidth)) + "px";
	}
}

function borderDiv() {
	border = document.createElement("div");
	border.setAttribute("class","border");
	border.setAttribute("id","border");
	p.appendChild(border);
	//Styling the border
	border.style.left = -3 + "px";
	border.style.top = -3 + "px";
	border.style.border = 3 + "px solid black";
	border.style.borderTop = 3 + "px solid red";
}

function randomNumber(min, max) {  
	// Function to generate random number 
	return Math.round(Math.random() * (max - min) + min); 
}

function game() {
	raf(game);	
	blockArray = [block,b2,b3,b4];
	gapArray = [gap,g2,g3,g4];
	//if it os blur then thhis code will not work
	if(blur == true) {return;}
    //Block and gap movement
    for (let i = 0; i < blockArray.length; i++) {

    if(blockArray[i].offsetTop > p.offsetHeight - blockArray[i].offsetHeight) {
    	blockArray[i].style.backgroundColor = "white";
    } else {
    	blockArray[i].style.backgroundColor = "black";
    }

    if (blockArray[i].offsetTop <= 0 && gapArray[i].offsetTop <= 0) {
    	//if the block goes above the top
    	blockArray[i].style.top = ((p.offsetHeight - 6) - blockArray[i].offsetHeight ) + "px";
		gapArray[i].style.top = ((p.offsetHeight - 6) - gapArray[i].offsetHeight ) + "px";
		gapArray[i].style.width = randomNumber(60,100) + "px";
		gapArray[i].style.left = randomNumber(0, (p.offsetWidth - gapArray[i].offsetWidth)) + "px";
		downArray[i] = false;
		score++;
		//Score 
		if(score == 5) {blockSpeed += 0.25;}
		else if (Number.isInteger(score/15)) {
			if(blockSpeed == 1.75) {blockSpeed += 0.25;}
			else {
				blockSpeed += 0.5;
				sound.playbackRate += 0.1; 
			}
		}
		document.getElementById("score").innerHTML ="SCORE : " + score;
    }
    else if(shrunk == false) {
    	blockArray[i].style.top = (blockArray[i].offsetTop - blockSpeed) + "px";
		gapArray[i].style.top = (gapArray[i].offsetTop - blockSpeed) + "px"; 	
    }
    //All about ball w.r.t block & gap
    if(ball.offsetTop + ball.offsetHeight >= blockArray[i].offsetTop && downArray[i] == false) {
    	if(ball.offsetLeft >= gapArray[i].offsetLeft && ball.offsetLeft + ball.offsetWidth <= gapArray[i].offsetLeft + gapArray[i].offsetWidth) {}
    	else if(ball.offsetTop  <= blockArray[i].offsetTop) {
    		ball.style.top = (blockArray[i].offsetTop - ball.offsetHeight - 0.5) + "px";
    	}
    } 
    else {//gap
    	if(ball.offsetLeft <= gapArray[i].offsetLeft && (ball.offsetTop + (ball.offsetHeight) > gapArray[i].offsetTop) && (ball.offsetTop < gapArray[i].offsetTop + gapArray[i].offsetHeight) && downArray[i] == true) {
    		ball.style.left = gapArray[i].offsetLeft + "px";
    	}
    	else if(ball.offsetLeft + ball.offsetWidth >= gapArray[i].offsetLeft + gapArray[i].offsetWidth && (ball.offsetTop + (ball.offsetHeight) > gapArray[i].offsetTop) && (ball.offsetTop < gapArray[i].offsetTop + gapArray[i].offsetHeight) && downArray[i] == true) {
    		ball.style.left = ((gapArray[i].offsetLeft + gapArray[i].offsetWidth) - ball.offsetWidth)  + "px";
    	}
    }  
	}
}

function gameOver() {
	raf(gameOver);
	blockArray = [block,b2,b3,b4];
	var gOvr = document.getElementById("myAudio2");
	var shrinkSound = document.getElementById("myAudio3");

	if(ball.offsetTop < 0) {
		window.removeEventListener("keydown",keyPush);
		blur = true; 
		ball.style.top = 0 + "px";
		sound.pause();
    	clearInterval(audioInterval);

		setInterval(() => {			
			if(ball.offsetWidth > 0 && ball.offsetWidth > 0) {
				let decrement = 5;
				shrinkSound.play();
				ball.style.top = (ball.offsetTop + decrement/2) + "px";
				ball.style.left = (ball.offsetLeft + decrement/2) + "px"
				ball.style.width = (ball.offsetWidth -   decrement) + "px";
				ball.style.height = (ball.offsetHeight -   decrement) + "px";
			} else {
				shrunk = true;
			}
		},1000/5)

		setTimeout(() => {
    		if(shrunk == true) {
    			window.game = function(){};
    			for (var i = 0; i < blockArray.length; i++) {
    				blockArray[i].style.backgroundColor = "white";   
    			}
    			border.style.border = "none";
    			p.style.border = "none";
    			document.getElementById('span').style.visibility = "visible";
    			document.getElementById('span').innerHTML = "Press to Restart";
    			document.getElementById('h1').style.fontSize = 50 + "px";
    			document.getElementById('h1').innerHTML = "GAME" + "<br>" + "OVER" + "<br>" + "<span class='span' id='endScore'>" + "SCORE : " + score + "</span>";
    			document.getElementById('endScore').style.fontSize = 30 + "px";

    			gOvr.play();

    			window.addEventListener ("keydown",() => {
    				setTimeout(() => {
    					location.reload();
    				},1000/5);}
    			);
    		}
    	},1000*2);
    }
}

function keyPush(evt) {
	blockArray = [block,b2,b3,b4];
	gapArray = [gap,g2,g3,g4];
	let key = evt.which;
	clearInterval(interval);
	//if it os blur then thhis code will not work
	if(blur == true) {return;}

	interval = setInterval(() => {
	for (let i = 0; i < blockArray.length; i++) {
		if(key == 37 || key == 97 || key == 65) {
			stuckInRight = false;
			if (ball.offsetLeft <= 0) {
        		ball.style.left = 0 + "px";
        		collide.play();
        		stuckInLeft = true;
    		}
    		else if(ball.offsetLeft <= gapArray[i].offsetLeft && (ball.offsetTop + (ball.offsetHeight) > gapArray[i].offsetTop) && (ball.offsetTop < gapArray[i].offsetTop + gapArray[i].offsetHeight) && downArray[i] == true) {
    			ball.style.left = gapArray[i].offsetLeft + "px";
    		}
    		else {
    			if(stuckInLeft == false) {
    				ball.style.left = ball.offsetLeft - ballSpeed + "px";
    			}
    		}
		}
		else if(key == 39 || key == 100 || key == 68) {
			stuckInLeft = false;
			if (ball.offsetLeft >= (p.offsetWidth - 6) - (ball.offsetWidth)) {
        		ball.style.left = ((p.offsetWidth - 6) - (ball.offsetWidth)) + "px";
        		collide.play();
        		stuckInRight == true;
        	} 
    		else if(ball.offsetLeft + ball.offsetWidth >= gapArray[i].offsetLeft + gapArray[i].offsetWidth && (ball.offsetTop + (ball.offsetHeight) > gapArray[i].offsetTop) && (ball.offsetTop < gapArray[i].offsetTop + gapArray[i].offsetHeight) && downArray[i] == true) {
    			ball.style.left = ((gapArray[i].offsetLeft + gapArray[i].offsetWidth) - ball.offsetWidth)  + "px";
    		} 
    		else {
    			if(stuckInRight == false) {
    				ball.style.left = ball.offsetLeft + ballSpeed + "px";
    			}
    		}
		}
		else if(key == 40 || key == 115 || key == 83) {
			if (ball.offsetTop >= (p.offsetHeight - 6) - (ball.offsetHeight)) {
        		ball.style.top = ((p.offsetHeight - 6) - (ball.offsetHeight)) + "px";
    		}
    		else if(ball.offsetLeft >= gapArray[i].offsetLeft && ball.offsetLeft + ball.offsetWidth <= gapArray[i].offsetLeft + gapArray[i].offsetWidth) {
    			ball.style.top = ball.offsetTop + ballSpeed + "px";
    			downArray[i] = true;
    		} 
    		else {
    			ball.style.top = ball.offsetTop + ballSpeed + "px";
    		}
		}		
	}
	},1000/FPS);
}

function keyUp() {
	clearInterval(interval);
}

function raf(func) {
	requestAnimationFrame(func);
}