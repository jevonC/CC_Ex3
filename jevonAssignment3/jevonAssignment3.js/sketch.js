//"character" global values
var charY = 440; //only Y value of character will change
var charSpeed = 0;
var charGravity = 0.4;

//"stranger" global values
var strangerX = -20; //will always be reset, for initial strangerX<-10
var strangerChance;
var strangerR; //each stranger's colour is randomised
var strangerG; //each stranger's colour is randomised
var strangerB; //each stranger's colour is randomised

//"walls" global values
var wall1X = -10; //only X value of wall1 will change
var wall2X = -10; //only X value of wall2 will change
var wall3X = -10; //only X value of wall3 will change

//global mouse dist formula
var mouseDist;

function setup() {
  //some assigning of values for "stranger" that p5 requires >:(
  strangerChance = random(2);
  strangerR = random(255);
  strangerG = random(255);
  strangerB = random(255);

  //restating formula for mouseDist
  //(how is it that the other global values declared before setup are understood, btw?)
  mouseDist = dist(0, 0, mouseX, mouseY);

  createCanvas(1200, 600);
  //background(217, 163, 163);
  background(200);
  smooth();
  frameRate(30);
}

function draw() {

  //this rectangle, in the same colour as the sky,  resets everything poking slightly out of the brown land
  rectMode(CORNER);
  fill(200);
  rect(0, 255, width, 70);

  //brown land
  fill(217, 181, 160);
  rect(0, 325, width, 325);

  //laying the conditionals out first...
  if (mouseX < width / 2) { //when mouse is to the left of character, and character moves LEFT
    //character bounces
    circleMove(); //a function that changes charY, does affecting the position of all shapes forming the character
    //wall1 moves right (as character moves LEFT)
    wall1Right();
    //wall2 moves right
    wall2Right();
    //wall3 moves right
    wall3Right();
  } else { //when mouse is to the right of character, and character moves RIGHT
    //character bounces
    circleMove();
    //wall1 moves left
    wall1Left();
    //wall2 moves left
    wall2Left();
    //wall3 moves left
    wall3Left();
  }

  //calling coloured sky (modified from example 4.6 in the textbook!)
  //it seems that though processing cannot  register multiple keyboard values at once, it can register keyboard+mouse values simultaneously!
  //if i leave mouse somewhere and press SPACEBAR, sky colours can form as character walks
  if (keyIsPressed) {
    if (keyCode == 32 && frameCount % 2 === 0) { //had to change key==32 into keyCode==32, not sure why because isn't the spacebar as ASCII key?
      var skyChance = random(10); // splitting the probablity of circles forming at different altitudes, so there's variation in texture
      //range of 2nd value, the center's y-value, changes for each "if"
      if (skyChance <= 0.3) { //3% chance
        sky(random(width), random(180, 240), random(255), random(255), random(255), random(125));
      }
      if (skyChance > 0.3 && skyChance <= 1.8) { //15% chance
        sky(random(width), random(120, 180), random(255), random(255), random(255), random(125));
      }
      if (skyChance > 1.8 && skyChance <= 4.9) { //31% chance
        sky(random(width), random(60, 120), random(255), random(255), random(255), random(125));
      }
      if (skyChance > 4.9 && skyChance <= 10) { //51% chance
        sky(random(width), random(0, 60), random(255), random(255), random(255), random(125));
      }
    }
  }

  //calling stranger
  stranger(); //colour and walking direction is randomised, see function below

  //calling wall1, wall2, and wall3 (wall1 being  nearest to the front)
  wall3Still();
  wall2Still();
  wall1Still();

  //calling character 
  //this is the body
  ellipseStill(600, charY + 165);
  //this is the triangle forming the white shirt, which flips along vertical axis depending on walking direction
  fill(255);
  if (mouseX <= width / 2) {
    triangle(577, charY + 32, 593, charY + 42, 561, charY + 77);
  } else {
    triangle(623, charY + 32, 607, charY + 42, 639, charY + 77);
  }
  //this is the head
  circleStill(600, charY);
}

//--------------------------------------------------------------HERE LIES FUNCTIONS

//SKY, modified from example 4.6 in textbook!
function sky(x, y, r, g, b, a) { //input 6 random values for every unique ellipse
  ellipseMode(CENTER);
  noStroke();
  fill(r, g, b, a);
  var diam = random(30);
  ellipse(x, y, diam, diam);
}

//every moving layer henceforth moves at different speeds to simulate parallax scrolling 
//STRANGER
function stranger() {
  //display body first
  noStroke();
  fill(strangerR, strangerG, strangerB); // these 3 global variables are random(255)
  ellipseMode(CENTER);
  rectMode(CENTER);
  ellipse(strangerX, 315, 10, 10); // head y value does not change, only variable for X required
  ellipse(strangerX, 330, 10, 20); // body y value does not change, only variable for X required
  fill(217, 181, 160); // this rectangle should be same colour as floor, obscures bottom of ellipse to make a body
  rect(strangerX, 335, 20, 10);

  //resetting strangerChance, which decides stranger's walking direction
  //interval between stranger events is long at 8000 frames, guarantees that strangers finish walking across screen even at slowest speed
  if (frameCount % 8000 == 1500) {
    strangerChance = random(2);
    strangerR = random(255);
    strangerG = random(255);
    strangerB = random(255);
  }

  //deciding stranger's SPEED and INITIAL POSITION
  if (frameCount % 8000 >= 1501 && frameCount % 8000 < 8000) {
    //if stranger is moving RIGHT
    if (strangerChance <= 1) {
      //resetting strangerX to STAGE LEFT, so stranger is reading to walk RIGHT
      if (frameCount % 8000 == 1502 && (strangerX < -10 || strangerX > -10)) {
        strangerX = -10;
      }
      if (mouseX < width / 2) { //stranger moves RIGHT + character moves LEFT = stranger seems to move faster
        strangerX = strangerX + 0.6;
      }
      if (mouseX > width / 2) { //stranger moves RIGHT + character moves RIGHT = stranger seems to move slower
        strangerX = strangerX + 0.2;
      }
    }

    //if stranger is moving LEFT
    if (strangerChance > 1) {
      if (frameCount % 8000 == 1502 && (strangerX < 1210 || strangerX > 1210)) {
        //resetting strangerX to STAGE RIGHT, so stranger is reading to walk LEFT
        strangerX = 1210;
      }
      if (mouseX < width / 2) { //stranger moves LEFT + character moves LEFT = stranger seems to move slower
        strangerX = strangerX - 0.2;
      }
      if (mouseX > width / 2) { //stranger moves LEFT + character moves RIGHT = stranger seems to move faster
        strangerX = strangerX - 0.6;
      }
    }
  }
}

//WALL3 FUNCTIONS
function wall3Still() {
  noStroke();
  var mouseDist = dist(width / 2, 0, mouseX, mouseY); //distance from top of middle of canvas
  var colour = map(mouseDist, 0, sqrt(720000), 0, 255); //position of mouse, mapped to RGB values 0-255, determines colour
  fill(colour, 180); //colour of wall3 same as colour of wall1, colour of wall2 is the complimentary (?) colour of wall1 and wall3

  //wall3 is made of two consecutive identical parts, so as to allow smooth jumping when end is reached
  //part 1
  triangle(wall3X + 10, 361, wall3X + 110, 361, wall3X + 60, 275); //wall3X is the leftmost non-ground point of wall3
  triangle(wall3X + 110, 361, wall3X + 410, 361, wall3X + 265, 255);
  triangle(wall3X + 420, 361, wall3X + 670, 361, wall3X + 545, 260);
  triangle(wall3X + 700, 361, wall3X + 790, 361, wall3X + 745, 306);
  triangle(wall3X + 830, 361, wall3X + 1150, 361, wall3X + 990, 266);

  //part 2 (part 1 with X values +1200, the size of the width)
  triangle(wall3X + 1210, 361, wall3X + 1310, 361, wall3X + 1260, 275);
  triangle(wall3X + 1310, 361, wall3X + 1610, 361, wall3X + 1465, 255);
  triangle(wall3X + 1620, 361, wall3X + 1870, 361, wall3X + 1745, 260);
  triangle(wall3X + 1900, 361, wall3X + 1990, 361, wall3X + 1945, 306);
  triangle(wall3X + 2030, 361, wall3X + 2350, 361, wall3X + 2190, 266);
}

//when wall3 is moving to the left
function wall3Left() {
  wall3X = wall3X - 0.5;
  if (wall3X < -1200) { //when leftmost part of wall3 less than -1200, reset wall3X to 0, like resetting a typewriter
    wall3X = 0;
  }
}

//when wall3 is moving to the right
function wall3Right() {
  wall3X = wall3X + 0.5;
  if (wall3X > 0) { //when leftmost part of wall3 exceeds 0, reset wall3X to -1200
    wall3X = -1200;
  }
}

//WALL2 FUNCTIONS (works the same way as WALL3)
function wall2Still() {
  noStroke();
  var mouseDist = dist(width / 2, 0, mouseX, mouseY);
  var colour = map(mouseDist, 0, sqrt(720000), 0, 255);
  fill(255 - colour, 180); //colour of wall3 same as colour of wall1, colour of wall2 is the complimentary (?) colour of wall1 and wall3

  //wall2 is made of two consecutive identical parts, so as to allow smooth scrolling
  //part 1
  triangle(wall2X + 90, 409, wall2X + 160, 409, wall2X + 125, 364);
  triangle(wall2X + 160, 409, wall2X + 460, 409, wall2X + 310, 282);
  triangle(wall2X + 510, 409, wall2X + 800, 409, wall2X + 655, 268);
  triangle(wall2X + 890, 409, wall2X + 980, 409, wall2X + 935, 309);
  triangle(wall2X + 980, 409, wall2X + 1100, 409, wall2X + 1040, 294);
  triangle(wall2X + 1120, 409, wall2X + 1198, 409, wall2X + 1159, 359);
  //part 2
  triangle(wall2X + 1290, 409, wall2X + 1360, 409, wall2X + 1325, 364);
  triangle(wall2X + 1360, 409, wall2X + 1660, 409, wall2X + 1510, 282);
  triangle(wall2X + 1710, 409, wall2X + 2000, 409, wall2X + 1855, 268);
  triangle(wall2X + 2090, 409, wall2X + 2180, 409, wall2X + 2135, 309);
  triangle(wall2X + 2180, 409, wall2X + 2300, 409, wall2X + 2240, 294);
  triangle(wall2X + 2320, 409, wall2X + 2398, 409, wall2X + 2359, 359);
}

function wall2Left() {
  wall2X = wall2X - 1;
  if (wall2X < -1200) {
    wall2X = 0;
  }
}

function wall2Right() {
  wall2X = wall2X + 1;
  if (wall2X > 0) {
    wall2X = -1200;
  }
}

//WALL1 FUNCTIONS
function wall1Still() {
  noStroke();
  var mouseDist = dist(width / 2, 0, mouseX, mouseY);
  var colour = map(mouseDist, 0, sqrt(720000), 0, 255);
  fill(colour, 180); //colour of wall3 same as colour of wall1, colour of wall2 is the complimentary (?) colour of wall1 and wall3
  //WALL1 is made of 2 identical parts
  //Part 1
  triangle(wall1X + 100, 477, wall1X + 300, 477, wall1X + 200, 300); //max height is 177
  triangle(wall1X + 380, 477, wall1X + 510, 477, wall1X + 445, 350);
  triangle(wall1X + 630, 477, wall1X + 830, 477, wall1X + 730, 307);
  triangle(wall1X + 830, 477, wall1X + 920, 477, wall1X + 875, 425);
  triangle(wall1X + 1000, 477, wall1X + 1180, 477, wall1X + 1090, 340);
  //Part 2
  triangle(wall1X + 1300, 477, wall1X + 1500, 477, wall1X + 1400, 300); //max height is 177
  triangle(wall1X + 1580, 477, wall1X + 1710, 477, wall1X + 1645, 350);
  triangle(wall1X + 1830, 477, wall1X + 2030, 477, wall1X + 1930, 307);
  triangle(wall1X + 2030, 477, wall1X + 2120, 477, wall1X + 2075, 425);
  triangle(wall1X + 2200, 477, wall1X + 2380, 477, wall1X + 2290, 340);
}

function wall1Left() {
  wall1X = wall1X - 1.5;
  if (wall1X < -1200) {
    wall1X = 0;
  }
}

function wall1Right() {
  wall1X = wall1X + 1.5;
  if (wall1X > 0) {
    wall1X = -1200;
  }
}

//CHARACTER FUNCTIONS
//character's head
function circleStill(x, y) {
  noStroke();
  fill(191, 59, 108);
  ellipse(x, y, 100, 100);
}

//character's body
function ellipseStill(x, y) {
  ellipseMode(CENTER);
  noStroke();
  fill(191, 59, 108);
  ellipse(600, y, 120, 300);
}

//character's bouncing, the changing of character's reference charY value
function circleMove() {
  //moving 
  charY = charY + charSpeed; // speed= dY / dX
  charSpeed = charSpeed + charGravity; //simulating effect of acceleration due to gravity, gravity= d2Y / dX2
  if (charY > 440) {
    charSpeed = charSpeed * -0.80; //simulates bounce, flip operation of charSpeed. 0.8 instead of 1 to simulate dampening effect of bounce
  }
}