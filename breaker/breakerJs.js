//Canvas Vars
var canvas;
var canvasContext;
var previewScreen = true;//This is a boolean
//Audio Vars
var audio  = document.getElementById("myAudio"); 
var audio2 = document.getElementById("myAudio2"); 
var audio3 = document.getElementById("myAudio3"); 
var audio4 = document.getElementById("myAudio4"); 
//Reset vars
var win = 8;
var score = 0;
var fallNo = 0;
var reset = 4;
//Ball Vars
var ballResetNo = 0;//ballReset number
var ballX = 500,ballY = 0;
var ballSpeedX = 12,ballSpeedXBup = 12;
var ballSpeedY = 10;
var ballRadius = 12;
//Paddle Vars
var paddleX,paddleY;
const PADDLE_HEIGHT = 20;
const PADDLE_THICKNESS = 150;
var color = 'white';
//Wall Vars
var wallColor = 'brown';
const WALL_HEIGHT = 25;
const WALL_THICKNESS = 90;
const GAP = WALL_HEIGHT + 5;
//1 row
const wallX = 5;// X value of walls
var wallY = 10;
var wallArray = [wallX, wallX + 100, wallX + 200, wallX + 300, wallX + 400, wallX + 500, wallX + 600, wallX + 700];

var wall2Y,wall3Y,wall4Y,wall5Y,wall6Y,wall7Y,wall8Y;
var arr1 = [],arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [], arr7 = [], arr8 = [];

var wallYArray = [wallY,wall2Y,wall3Y,wall4Y,wall5Y,wall6Y,wall7Y,wall8Y];

for (let i = 0; i < wallYArray.length; i++) {
	wallYArray[i] = wallY + i*GAP;
}

var arrayArray = [arr1,arr2,arr3,arr4,arr5,arr6,arr7,arr8];

for (let i = 0; i < arrayArray.length; i++) {
	arrayArray[i] = wallArray.map(value => {return value;});
}

function calMousePos(e) {
	//This function determines the position of the mouse pointer on the canvas 
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = e.clientX - rect.left - root.scrollLeft;
	var mouseY = e.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	raf(() => {
		drawEverything();
		animate();
	});	

	canvas.addEventListener('mousedown', e => {
		if(previewScreen == true) {
			previewScreen = false;
		}
		audio.play();
		ballSpeedY = -ballSpeedY;
		ballSpeedX = randomNumber(-12,12);
	},{once : true})

	paddleX = canvas.width/2 - PADDLE_THICKNESS/2; 
	canvas.addEventListener('mousemove', e => {
		var mousePos = calMousePos(e);
		//console.log(mousePos);
		if(previewScreen == false) {
			paddleX = mousePos.x - (PADDLE_THICKNESS/2);
		}
	})
	//The next code Pauses And Plays the game(i.e. animate function)
	var functionHolder = calMousePos;
	//console.log(functionHolder);
	window.addEventListener('blur', e => {
		if(score < win) {
			previewScreen = true;
		}
		window.calMousePos = function(){};
	});
	
	window.addEventListener('focus', e => {
		previewScreen = false;
		window.calMousePos = functionHolder;
		if(ballResetNo == 1 && fallNo > 0) {
			disable();
		}	
	});

	ballReset();
}

function ballReset() {
	//this function determines the position of the ball
	var paddleCenter = paddleX + PADDLE_THICKNESS/2;//center of the Paddle
	paddleY = canvas.height-40;

	if(paddleCenter <= 10) {
		ballX = paddleCenter + 10;
	}	
	else if(paddleCenter >= canvas.width - 10) {
		ballX = paddleCenter - 10;
	}
	else {
		ballX = paddleCenter;
	}

	ballY = paddleY - ballRadius;
	ballResetNo = 1;
}

function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function giveMouseValue(evt) {
	if(previewScreen == false) {return;}

	var mousePos = calMousePos(evt);
	if(mousePos.x >= ballRadius && mousePos.x <= canvas.width - ballRadius)	{				
		ballX = mousePos.x;
	}

	paddleX = canvas.width/2 - PADDLE_THICKNESS/2; 
	paddleX = mousePos.x-(PADDLE_THICKNESS/2);
}

function disable() {
	previewScreen = true;
	//console.log(previewScreen);
	canvas.addEventListener('mousemove',giveMouseValue);

	canvas.addEventListener('mousedown', e => {
		ballResetNo = 0;
		window.giveMouseValue = function(){};

		var mousePos = calMousePos(e);
		if(mousePos.x <= (ballRadius || 0)) {
			ballX = ballX  + 5;
			ballSpeedX = ballSpeedXBup;
		}
		else if(mousePos.x >= (canvas.width - ballRadius || canvas.width) ) {
			ballX = ballX - 5;
			ballSpeedX = -ballSpeedXBup;
		}
		else {
			ballSpeedX = 0;
		}

		if(color == 'white') {audio.play();}	

		previewScreen = false;
		ballSpeedY = -ballSpeedY;
	},{once : true})

	if(fallNo >= reset)	{
		//when you the ball crosses the end 3 times the game will reset
		window.drawWall = function(){};
		window.animate = function(){};
		color =	'black';
		ballSpeedY = 0;

		canvas.addEventListener('mousedown',() => {
			setTimeout(function(){location.reload();},1000/2)
		})
	}
}

function animate() {
	raf(animate);	

	if(previewScreen == true) {
		return;
	}

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < ballRadius) {
		ballSpeedX = -ballSpeedX;
		if(ballY < 10) {
			ballY += 15;
		}
	}

	if(ballX > canvas.width-ballRadius) {
		ballSpeedX = -ballSpeedX;
		if(ballY < 10) {
			ballY += 15;
		}
	}	

	if(ballY < ballRadius) {
		ballSpeedY = -ballSpeedY;
	}

	if(ballY > canvas.height){
		fallNo += 1;
		ballReset();
		disable();
	}

	paddleY = canvas.height-40;	
	//Ball collision and rebound code
	if(ballX > paddleX -ballRadius && ballX < (paddleX + ballRadius) + PADDLE_THICKNESS && ballY > paddleY - ballRadius && ballY < paddleY + PADDLE_HEIGHT) {		
		audio.play();

		if(ballY - ballRadius > PADDLE_HEIGHT + (PADDLE_HEIGHT - paddleY)) {
			if(ballX < 15) {
				ballX += 15;
			}
			else if(ballX > (canvas.width - 95) + WALL_THICKNESS - 10) {
				ballX -= 15;
			}
			else {			
				let angleX = ballX - (paddleX + PADDLE_THICKNESS/2);
				ballSpeedX = Math.round(angleX * 0.35);
			}
			if((paddleY && ballY < paddleY + PADDLE_HEIGHT) && (ballX > paddleX && ballX < paddleX + PADDLE_THICKNESS)) {
				ballY -= ballRadius;
			}
			
			ballSpeedY = -ballSpeedY;
		}
	}
	//Wall collision
	for (let i = 0; i < wallYArray.length; i++) {
		wallCollision(wallX,wallYArray[i],arrayArray[i]);
	}
}

function drawEverything() {
	raf(drawEverything);
	//next line draws a black canvas on the screen
	drawRect(0,0,canvas.width,canvas.height,'black');
	//Wall code
	for (let i = 0; i < wallYArray.length; i++) {
		drawWall(wallX,wallYArray[i],WALL_THICKNESS,WALL_HEIGHT,wallColor,arrayArray[i]);
	}

	if(previewScreen == true && fallNo < reset) {
		writeTxt('white','30px Courier',"Click to PLAY",canvas.width/2 - 130,canvas.height/2);
		writeTxt('white','20px Courier',"To PLAY keep the mouse in the GAME area",canvas.width/2 -230,canvas.height/2 + 50);
		let lives = (reset - fallNo) - 1;
		writeTxt('red','29px Verdana',"Lives = " + lives,canvas.width/2 - 70,canvas.height/2 + 100);
	}
	else if(fallNo >= reset) {
		writeTxt('white','80px "Press Start 2P",cursive',"GAME OVER",40,canvas.height/2);
		writeTxt('white','17px Verdana',"Click to continue",canvas.width/2 - 80,canvas.height - 100);
		audio2.play();
	}
	else if(score == win) {
		writeTxt('white','100px "Press Start 2P",cursive',"YOU WON",60,canvas.height/2);
		writeTxt('white','17px Verdana',"Click to PLAY again",canvas.width/2 - 100,canvas.height - 100);

		audio3.pause();
		audio4.play();
	}
	//next line draws a ball
	drawCircle(ballX,ballY,ballRadius,color);	
	//next line draws the left side player paddle
	paddleY = canvas.height-40;
	drawRect(paddleX,paddleY,PADDLE_THICKNESS,PADDLE_HEIGHT,color);//Good color = #003CDA
	drawRect(paddleX + 2,paddleY + 2,PADDLE_THICKNESS - 4,PADDLE_HEIGHT - 4,'black');
}

function drawCircle(centerX,centerY,radius,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}

function drawWall(leftX,topY,width,height,drawColor,arr) {
	for(let x = 0; x < arr.length ; x++) {
		leftX = arr[x];
		canvasContext.fillStyle = color;
		canvasContext.fillRect(leftX,topY,width,height);
		canvasContext.fillStyle = drawColor;	
		canvasContext.fillRect(leftX + 1,topY + 1,width,height);
	}
}

function wallCollision(x,y,arr) {
	for(x = 0; x < arr.length; x++) { 
		if(ballX - ballRadius < arr[x] +  WALL_THICKNESS  && ballX + ballRadius  > arr[x] && ballY - ballRadius < y + WALL_HEIGHT && ballY + ballRadius > y) {

			ballRebound(arr,x);		
			audio3.play();

			if(ballX + ballRadius  >= arr[x] && ballX - ballRadius <= arr[x] + WALL_THICKNESS) {
				delete arr[x];
			}
			winFunction(arr);
		}
	}
}

function ballRebound(arr,x) {
	//This is the ball rebound code which works in Wall Collision
	//arr is arr input & 'x' is the loop value in the wallCollision functions
	let angleX = ballX - (arr[x] + WALL_THICKNESS/2);
	if(ballX < 15) {
		ballSpeedX = -ballSpeedX/2;
	}
	else if(ballX > (canvas.width - 95) + WALL_THICKNESS - 10) {
		ballSpeedX = -ballSpeedX/2;
	}
	else {
		ballSpeedX = Math.round(angleX * 0.40);
	}
	ballSpeedY = -ballSpeedY;
}

function winFunction(arr) {
	let arrayBoolean = [];
	for (let i = 0; i < arrayArray.length; i++) {
		arrayBoolean[i] = arr.includes(wallArray[i]);
	}

	let superBoolean = arrayBoolean.includes(true);

	if(superBoolean == false) {
		score += 1;
		//console.log('score = ' + score);
		if(score == win) {
			color =	'black';
			ballSpeedY = 0;

			canvas.addEventListener('mousedown',() => {
				setTimeout(function(){location.reload();},1000/2)
			})
		}	
	}
}

function drawRect(leftX,topY,width,height,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}

function writeTxt(textColor,font,text,x,y) {
	canvasContext.fillStyle = textColor ;//Text color
	canvasContext.font = font;
	canvasContext.fillText(text,x,y);
}

function raf(func) {
	requestAnimationFrame(func);
}