//.Canvas Vars
var canvas;
var canvasContext;
//.Audio vars
var audio = document.getElementById("myAudio");
var audio2 = document.getElementById("myAudio2");
var collisionAudio = document.getElementById("myAudio3");
//.player vars
var p1Score = 0; //Player 1 Score
var p2Score = 0; //Computer Score
//.Win vars
const WIN_SCORE = 10;
var displayWinScreen = false; //This is a boolean
//.Ball Vars
var ballX = 0;
var ballSpeedX = 7;
var bSXBup = 7;
var ballY = 0;
var ballSpeedY = 7 / 2;
var bSYBup = 7 / 2;
//.Paddle Vars
var leftPaddleY = 250;
var leftPaddleX = 10;
var rightPaddleX;
var rightPaddleY = 250;
const PADDLE_THICKNESS = 15;
const PADDLE_HEIGHT = 100;

function calMousePos(evt) {
   //.This function determines the position of the mouse pointer on the canvas
   var rect = canvas.getBoundingClientRect();
   var root = document.documentElement;
   var mouseX = evt.clientX - rect.left - root.scrollLeft;
   var mouseY = evt.clientY - rect.top - root.scrollTop;
   return {
      x: mouseX,
      y: mouseY,
   };
}

window.onload = function () {
   window.scrollBy(0, -100);
};

function start() {
   document.getElementById("hide").style.visibility = "hidden"; // this code hides the button after clicked
   document.getElementById("para").style.visibility = "hidden";
   window.scrollBy(0, 100);
   //.This function is of Paramount Importance as it takes the values of the canvas
   //.and makes the animation possible and smoother
   canvas = document.getElementById("gameCanvas");
   canvasContext = canvas.getContext("2d");
   canvas.style.backgroundColor = "black";

   raf(() => {
      moveEverything();
      drawEverything();
   }); //.running at 60fps

   canvas.addEventListener("mousedown", (e) => {
      if (displayWinScreen == true) {
         location.reload();
      }
   });

   canvas.addEventListener("mousemove", (e) => {
      var mousePos = calMousePos(e);
      leftPaddleY = mousePos.y - PADDLE_HEIGHT / 2;
   });
   //.The next code Pauses And Plays the game(i.e. animate function)
   let functionHolder = moveEverything;
   let mousePosHolder = calMousePos;
   window.addEventListener("blur", (e) => {
      window.moveEverything = function () {};
      window.calMousePos = function () {};
   });

   window.addEventListener("focus", (e) => {
      window.moveEverything = functionHolder;
      window.calMousePos = mousePosHolder;
      raf(moveEverything);
   });
   ballPosition(); //Calling functions
}

function randomNumber(min, max) {
   //. Function to generate random number
   return Math.round(Math.random() * (max - min) + min);
}

function ballPosition() {
   ballX = randomNumber(50, canvas.width - 50); //.console.log('balXY = ' + ballX);
   ballY = randomNumber(10, canvas.height - 10); //.console.log('ballY = ' + ballY);
}

function ballReset() {
   //.This function resets the ball at the center once it hits either of vertical sides
   //.And resets the score
   if (p1Score >= WIN_SCORE || p2Score >= WIN_SCORE) {
      displayWinScreen = true;
   }
   ballSpeedX = -ballSpeedX;
   ballX = canvas.width / 2;
   ballY = randomNumber(canvas.height - canvas.height + 10, canvas.height - 10);
}

function paddleAI() {
   if (ballY - 40 > rightPaddleY + PADDLE_HEIGHT / 2) {
      rightPaddleY += 12.5;
   }
   //.+= is the same as rightPaddleY = rightPaddleY + 5 i.e. A=A+B == A += B
   else if (ballY + 40 < rightPaddleY + PADDLE_HEIGHT / 2) {
      rightPaddleY -= 12.5;
   }
   //.-= is the same as rightPaddleY = rightPaddleY - 5 i.e. A=A-B == A -= B
}

function moveEverything() {
   raf(moveEverything);
   if (displayWinScreen == true) {
      return;
   }

   paddleAI();
   //.This function animates(moves) all the objects
   ballX = ballX + ballSpeedX;
   ballY = ballY + ballSpeedY;

   if (ballX < PADDLE_THICKNESS + 20) {
      if (ballX < 0) {
         //.If the ball hits the left wall it(ball) will reset
         p2Score += 1; //.Computer Score //This code must be before ballReset()
         ballReset();
      } else if (ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT) {
         if (ballX < 10) {
            //. if the ball is in the range behind the left paddle (X co-ordinate) it(ball) will reset
            p2Score += 1; //.Computer Score //This code must be before ballReset()
            ballReset();
            console.log("its behind in the left");
         } else {
            collisionAudio.play();
            ballSpeedX = -ballSpeedX;
            var angleY = ballY - (leftPaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = Math.round(angleY * 0.35);
            //.console.log(ballSpeedY + ' Left Paddle');
         }

         if (
            leftPaddleX &&
            ballX < leftPaddleX + PADDLE_HEIGHT &&
            ballX > leftPaddleY &&
            ballX < leftPaddleY + PADDLE_THICKNESS
         ) {
            ballSpeedY = +ballSpeedY;
         }
      }
   }

   if (ballX > canvas.width - (PADDLE_THICKNESS + 20)) {
      if (
         ballX > rightPaddleX &&
         ballX < rightPaddleX + PADDLE_THICKNESS &&
         ballY > rightPaddleY + 10 &&
         ballY < rightPaddleY + PADDLE_HEIGHT - 10
      ) {
         //.console.log("in between");
         ballX = canvas.width / 2;
         ballY = canvas.height / 2;
         ballSpeedX = -bSXBup;
         ballSpeedY = -bSYBup;
      }
      if (ballX > canvas.width) {
         //.If the ball hits the right wall it(ball) will reset
         p1Score += 1; //.Player 1 Score //This code must be before ballReset()
         ballReset();
      } else if (ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT) {
         if (ballX > canvas.width - 10) {
            //.if the ball is in the range behind the right paddle (X co-ordinate) it(ball) will reset
            p1Score += 1; //.Computer Score //This code must be before ballReset()
            ballReset();
            console.log("its behind in the right");
         } else {
            collisionAudio.play();
            ballSpeedX = -ballSpeedX;
            var angleY = ballY - (rightPaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = Math.round(angleY * 0.35);
            //.console.log(ballSpeedY + ' Right Paddle');
         }
         if (
            rightPaddleX &&
            ballX < rightPaddleX + PADDLE_HEIGHT &&
            ballX > rightPaddleY &&
            ballX < rightPaddleY + PADDLE_THICKNESS
         ) {
            ballSpeedY = +ballSpeedY;
         }
      }
   }
   if (ballY < 10) {
      ballSpeedY = -ballSpeedY;
   }
   if (ballY > canvas.height - 10) {
      ballSpeedY = -ballSpeedY;
   }
}

function drawNet() {
   //.Net(Tennis) Vars
   const NET_THICKNESS = 3;
   const NET_HEIGHT = 20;

   for (let i = 10; i < canvas.height; i += 40) {
      drawRect(
         canvas.width / 2 - NET_THICKNESS / 2,
         i,
         NET_THICKNESS,
         NET_HEIGHT,
         "white"
      );
   }
}

function drawEverything() {
   raf(drawEverything);
   canvasContext.clearRect(0, 0, canvas.width, canvas.height);

   if (displayWinScreen == true) {
      if (p1Score >= WIN_SCORE) {
         audio2.play();
         let pN = document.getElementById("pName").value;
         //.player name
         if (pN == "") {
            writeTxt(
               "white",
               '50px "Press Start 2P",cursive',
               "Player 1 WON",
               100,
               canvas.height / 2
            );
         } else {
            writeTxt(
               "white",
               '50px "Press Start 2P",cursive',
               pN + " WON",
               100,
               canvas.height / 2
            );
         }
         writeTxt(
            "white",
            "15px Courier",
            "Click to Continue",
            canvas.width / 2 - 70,
            canvas.height - 50
         );
      } else if (p2Score >= WIN_SCORE) {
         audio.play();
         writeTxt(
            "white",
            '80px "Press Start 2P",cursive',
            "GAME OVER",
            40,
            canvas.height / 2
         );
         writeTxt(
            "white",
            "15px Courier",
            "Click to Continue",
            canvas.width / 2 - 70,
            canvas.height - 50
         );
      }
      return;
   }
   //.the next line calls the drawNet() function and draws te net
   drawNet();
   //.next line draws a ball
   drawCircle(ballX, ballY, 10, "white");
   //.next line draws the left side player paddle
   drawRect(leftPaddleX, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
   //.next line draws the right side player paddle
   rightPaddleX = canvas.width - PADDLE_THICKNESS - 10;
   drawRect(
      rightPaddleX,
      rightPaddleY,
      PADDLE_THICKNESS,
      PADDLE_HEIGHT,
      "white"
   );
   //.the next lines prints text on the canvas;
   let pN = document.getElementById("pName").value; //.This is the Player name

   if (pN == "") {
      writeTxt("white", "25px Courier", "Player1's Score = " + p1Score, 50, 50);
   } else {
      writeTxt("white", "25px Courier", pN + "'s Score = " + p1Score, 50, 50);
   }
   writeTxt(
      "white",
      "25px Courier",
      "Computer's Score = " + p2Score,
      canvas.width - 330,
      50
   );
}

function drawCircle(centerX, centerY, radius, drawColor) {
   //.This is a helper function for drawing a circle
   canvasContext.fillStyle = drawColor;
   canvasContext.beginPath();
   canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
   canvasContext.fill();
}

function drawRect(leftX, topY, width, height, drawColor) {
   //.this function reduces the code to draw(this is a helper function too)
   canvasContext.fillStyle = drawColor;
   canvasContext.fillRect(leftX, topY, width, height);
}

function writeTxt(textColor, font, text, x, y) {
   canvasContext.fillStyle = textColor; //.Text color
   canvasContext.font = font;
   canvasContext.fillText(text, x, y);
}

function raf(func) {
   requestAnimationFrame(func);
}
