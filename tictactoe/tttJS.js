//Canvas Vars
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var win = false;
var mobile = false;
//block vars || grid vars
var lineColor = "white";
var blockColor = "black";
var bSize = Math.floor(canvas.width / 3);
var random = randomNumber(1, 2);
//row1
var block1 = { x: 0, y: 0, nut: false, cross: false };
var block2 = { x: bSize, y: 0, nut: false, cross: false };
var block3 = { x: bSize * 2, y: 0, nut: false, cross: false };
///row2
var block4 = { x: 0, y: bSize, nut: false, cross: false };
var block5 = { x: bSize, y: bSize, nut: false, cross: false };
var block6 = { x: bSize * 2, y: bSize, nut: false, cross: false };
//row3
var block7 = { x: 0, y: bSize * 2, nut: false, cross: false };
var block8 = { x: bSize, y: bSize * 2, nut: false, cross: false };
var block9 = { x: bSize * 2, y: bSize * 2, nut: false, cross: false };
//array of blocks
var blockArray = [
   block1,
   block2,
   block3,
   block4,
   block5,
   block6,
   block7,
   block8,
   block9,
];

function callEventPos(evt) {
   //This function determines the position of the mouse pointer on the canvas
   let rect = canvas.getBoundingClientRect();
   let root = document.documentElement;
   let eventX = evt.clientX - rect.left - root.scrollLeft;
   let eventY = evt.clientY - rect.top - root.scrollTop;
   return {
      x: eventX,
      y: eventY,
   };
}

function randomNumber(min, max) {
   return Math.round(Math.random() * (max - min) + min);
}

window.onload = () => {
   if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
         navigator.userAgent
      )
   ) {
      mobile = true;
      canvas.style.width = "100%";
      canvas.style.height = canvas.offsetWidth - canvas.style.borderWidth;
      setInterval(() => {
         let h2 = document.getElementById("h2");
         h2.style.marginLeft = 0 + "px";
         h2.style.textAlign = "center";
      }, 1000 / 60);
   }

   requestAnimationFrame(drawEverything);
   canvas.addEventListener("touchstart", giveDrawInfo);
   canvas.addEventListener("mousedown", giveDrawInfo);
};

function giveDrawInfo(evt) {
   let eventPos = callEventPos(evt);
   for (let i = 0; i < blockArray.length; i++) {
      if (
         eventPos.x > blockArray[i].x &&
         eventPos.x < blockArray[i].x + bSize &&
         eventPos.y > blockArray[i].y &&
         eventPos.y < blockArray[i].y + bSize
      ) {
         //console.log(blockArray[i]);
         if (random == 1) {
            if (blockArray[i].cross == false) {
               blockArray[i].nut = true;
               pointNut();
               random = 2;
            }
         }
         if (random == 2) {
            if (blockArray[i].nut == false) {
               blockArray[i].cross = true;
               pointCross();
               random = 1;
            }
         }
      }
   }
}

function drawEverything() {
   //Grid lines
   for (let i = 0; i < canvas.width; i += bSize) {
      drawLine(i, 0, i, canvas.height, lineColor, 5);
      drawLine(0, i, canvas.width, i, lineColor, 5);
   }
   //Nuts and crosses
   for (let i = 0; i < blockArray.length; i++) {
      if (blockArray[i].nut == true) {
         nut(blockArray[i]);
      } else if (blockArray[i].cross == true) {
         cross(blockArray[i]);
      }
   }
   requestAnimationFrame(drawEverything);
}

function pointNut() {
   //Vertical
   if (
      (block1.nut == true && block4.nut == true && block7.nut == true) ||
      (block2.nut == true && block5.nut == true && block8.nut == true) ||
      (block3.nut == true && block6.nut == true && block9.nut == true)
   ) {
      winFunction(nut);
   }
   //Horizontal
   else if (
      (block1.nut == true && block2.nut == true && block3.nut == true) ||
      (block4.nut == true && block5.nut == true && block6.nut == true) ||
      (block7.nut == true && block8.nut == true && block9.nut == true)
   ) {
      winFunction(nut);
   }
   //Diagonal
   else if (
      (block1.nut == true && block5.nut == true && block9.nut == true) ||
      (block3.nut == true && block5.nut == true && block7.nut == true)
   ) {
      winFunction(nut);
   } else {
      tieFunction();
   }
}

function pointCross() {
   //Vertical
   if (
      (block1.cross == true && block4.cross == true && block7.cross == true) ||
      (block2.cross == true && block5.cross == true && block8.cross == true) ||
      (block3.cross == true && block6.cross == true && block9.cross == true)
   ) {
      winFunction(cross);
   }
   //Horizontal
   else if (
      (block1.cross == true && block2.cross == true && block3.cross == true) ||
      (block4.cross == true && block5.cross == true && block6.cross == true) ||
      (block7.cross == true && block8.cross == true && block9.cross == true)
   ) {
      winFunction(cross);
   }
   //Diagonal
   else if (
      (block1.cross == true && block5.cross == true && block9.cross == true) ||
      (block3.cross == true && block5.cross == true && block7.cross == true)
   ) {
      winFunction(cross);
   } else {
      tieFunction();
   }
}

function winFunction(side) {
   setTimeout(() => {
      //changing the position of text
      if (mobile == false) {
         document.getElementById("h2").style.marginLeft = "100px";
      }

      if (side == nut) {
         document.getElementById("h2").innerHTML = "'O' WON";
         win = true;
      } else if (side == cross) {
         document.getElementById("h2").innerHTML = "'X' WON";
         win = true;
      }
      //removing mousedown EventListener
      canvas.removeEventListener("mousedown", giveDrawInfo);
      canvas.removeEventListener("touchstart", giveDrawInfo);
      //Reloading for new game
      setTimeout(() => {
         location.reload();
      }, 1000 * 1.5);
   }, 1000 / 5);
}

function tieFunction() {
   if (win == false) {
      setTimeout(() => {
         let tie = blockArray.every((el) => {
            //the Every method checks all values in the array
            if (el.cross == true || el.nut == true) {
               return true;
            }
         });
         if (tie == true) {
            //removing mousedown EventListener
            canvas.removeEventListener("mousedown", giveDrawInfo);
            canvas.removeEventListener("touchstart", giveDrawInfo);
            //changing the position of text
            if (mobile == false) {
               document.getElementById("h2").style.marginLeft = "150px";
            }
            //displaying TIE
            document.getElementById("h2").innerHTML = "TIE";
            //Reloading for new game
            setTimeout(() => {
               location.reload();
            }, 1000 * 1.5);
         }
      }, 1000 / 5);
   }
}

function cross(block) {
   //Cross
   let gap = 20;
   drawLine(
      block.x + gap,
      block.y + gap,
      block.x + bSize - gap,
      block.y + bSize - gap,
      "red",
      10
   );
   drawLine(
      block.x + bSize - gap,
      block.y + gap,
      block.x + gap,
      block.y + bSize - gap,
      "red",
      10
   );
}

function nut(block) {
   //Nut
   let radius = bSize - 23;
   drawCircle(
      block.x + bSize - bSize / 2,
      block.y + bSize - bSize / 2,
      radius / 2,
      "yellow"
   );
   drawCircle(
      block.x + bSize - bSize / 2,
      block.y + bSize - bSize / 2,
      radius / 2 - 10,
      blockColor
   );
}

function drawCircle(centerX, centerY, radius, drawColor) {
   //This is a helper function for drawing a circle
   ctx.fillStyle = drawColor;
   ctx.beginPath();
   ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
   ctx.fill();
}

function drawLine(x1, y1, x2, y2, lColor, lWidth) {
   ctx.strokeStyle = lColor;
   ctx.lineWidth = lWidth;
   ctx.beginPath();
   ctx.moveTo(x1, y1);
   ctx.lineTo(x2, y2);
   ctx.stroke();
}

function drawRect(leftX, topY, width, height, drawColor) {
   //this function reduces the code to draw(this is a helper function too)
   ctx.fillStyle = drawColor;
   ctx.fillRect(leftX, topY, width, height);
}
