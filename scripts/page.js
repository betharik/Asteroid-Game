// ===================== Fall 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Div Handlers
let game_window;

// Game Object Helpers
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 5;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds
let COVID_SPEED = 1;

// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;

// Start Var
let firstLoad = true;
let diffLevel = 'normal';
let volLev = 50;

// Constants
var PERSON_MOVEMENT = 30;   // px
var ROCKET_SPEED = 10;
var OBJECT_REFRESH_TIME = 70; // ms

// Global Object Handles
var person;

// Counters
var covidIdx = 1;

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
    // ====== Startup ====== 
    game_window = $('.game-window');
    
    person = $('.person');

    console.log("Max X is: " + maxPersonPosX); 
    console.log("Max Y is: " + maxPersonPosY);
});

// TODO: ADD YOUR FUNCTIONS HERE

// Keydown event handler
document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
    movePerson();
}

// Keyup event handler
document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

function startGame() {
  $('.person').append("<img id='player' src='./src/player/player.gif'>").hide();
  $('.person').delay(3000).fadeIn();
  
  setTimeout(spawnCovid, 3000);
}

// Person
function movePerson() {
  if (LEFT && UP) {
    console.log("moving diag up left"); 
    var upPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (upPos < 0) {
      upPos = 0; 
    }
    var lPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (lPos < 0) {
      lPos = 0; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    $('#player').attr('src', './src/player/player_up.gif');
  }
  else if (LEFT && DOWN) {
    console.log("moving diag down left"); 
    var upPos = parseInt(person.css("top")) + PERSON_MOVEMENT; 
    if (upPos > maxPersonPosY) {
      upPos = maxPersonPosY; 
    }
    var lPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (lPos < 0) {
      lPos = 0; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    $('#player').attr('src', './src/player/player_down.gif');
  }
  else if (RIGHT && UP) {
    console.log("moving diag up right"); 
    var upPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (upPos < 0) {
      upPos = 0; 
    }
    var lPos = parseInt(person.css("left")) + PERSON_MOVEMENT; 
    if (lPos > maxPersonPosX) {
      lPos = maxPersonPosX; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    $('#player').attr('src', './src/player/player_up.gif');
  }
  else if (RIGHT && DOWN) {
    console.log("moving diag down right"); 
    var upPos = parseInt(person.css("top")) + PERSON_MOVEMENT; 
    if (upPos > maxPersonPosY) {
      upPos = maxPersonPosY; 
    }
    var lPos = parseInt(person.css("left")) + PERSON_MOVEMENT; 
    if (lPos > maxPersonPosX) {
      lPos = maxPersonPosX; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    $('#player').attr('src', './src/player/player_down.gif');
  }
  else if (LEFT) {
    console.log("moving left"); 
    var newPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (newPos < 0) {
      newPos = 0; 
    }
    person.css("left", newPos); 
    $('#player').attr('src', './src/player/player_left.gif');
  }
  else if (UP) { 
    console.log("moving up"); 
    var newPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (newPos < 0) {
      newPos = 0; 
    }
    person.css("top", newPos)
    $('#player').attr('src', './src/player/player_up.gif');
  }
  else if (DOWN) {
    console.log("moving down"); 
    var newPos = parseInt(person.css("top")) + PERSON_MOVEMENT;
    if (newPos > maxPersonPosY) {
      newPos = maxPersonPosY; 
    }
    person.css("top", newPos); 
    $('#player').attr('src', './src/player/player_down.gif');
  }
  else if (RIGHT) {
    console.log("moving right");
    var newPos = parseInt(person.css("left")) + PERSON_MOVEMENT;
    if (newPos > maxPersonPosX) {
      newPos = maxPersonPosX; 
    }
    person.css("left", newPos);
    $('#player').attr('src', './src/player/player_right.gif');
  }
}

// Covid
function spawnCovid() {
  console.log('Spawning Covid...');

  setInterval( function () {
    fireOne();
  }, 5000); // 500
}

function fireOne() {
  // one covid, determine starting point
  console.log("fire one comet");
  var covidDiv = "<img src='./src/covidstriod.png' style='position: absolute;' id='c-" + covidIdx + "'/>";
  $('.curAstroid').append(covidDiv);
  $(".curAstroid").fadeIn();

  var curCovid = $('#c-' + covidIdx);

  var corner = parseInt(getRandomNumber(1,5));
  var startX; 
  var startY;

  console.log("corner " + corner);

  // if (corner == 1) {
  //   // left
  //   startX = -40;
  //   startY = getRandomNumber(-40, maxPersonPosY + 40);
  // }
  // else if (corner == 2) {
  if (corner == 2) {
    // right
    startX = maxPersonPosX + 40;
    startY = getRandomNumber(-40, maxPersonPosY + 40);
  }
  else if (corner == 3) {
    // down
    startY = maxPersonPosY + 40;
    startX = getRandomNumber(-40, maxPersonPosX + 40);
  }
  // else if (corner == 4) {
  //   // up
  //   startY = -40;
  //   startX = getRandomNumber(-40, maxPersonPosX + 40);
  // }

  curCovid.css({"top": startY, 'left': startX});
  moveCovid("#c-" + covidIdx);

  covidIdx++;
}

function moveCovid(comet) {
  var curCovid = $(comet);
  console.log("comet " + comet);

  // if (diffLevel == 'easy') {
  //   COVID_SPEED= COVID_SPEED*1;
  // }
  // else if (diffLevel == 'normal') {
  //   COVID_SPEED = COVID_SPEED*3;
  // }
  // else if (diffLevel == 'hard') {
  //   COVID_SPEED = COVID_SPEED*5;
  // }

  var x = parseInt(curCovid.css("left"))
  var y = parseInt(curCovid.css("top"));

  var COVID_SPEED_X;
  var COVID_SPEED_Y;  

  if (x < 0) {
    console.log("top pos");
    COVID_SPEED_X = COVID_SPEED;
  }
  else if (x > maxPersonPosX) {
    console.log("right negative speed'");
    COVID_SPEED_X = -(COVID_SPEED);
  }
  if (y < 0) {
    console.log("left pos");
    COVID_SPEED_Y = COVID_SPEED;
  }
  else if (y > maxPersonPosY) {
    console.log("down negative speed");
    COVID_SPEED_Y = -(COVID_SPEED);
  }

  setInterval( function() {
    shootCovid(comet, COVID_SPEED_X, COVID_SPEED_Y)}, 5000); //AST_OBJECT_REFRESH_RATE
}

function shootCovid(comet, COVID_SPEED_X, COVID_SPEED_Y) {
  var curCovid = $(comet);
  console.log("moving");
  console.log("speedX, speedY " + COVID_SPEED_X + "  " + COVID_SPEED_Y);
  curCovid.css("top", parseInt(curCovid.css("top")) + COVID_SPEED_Y);
  curCovid.css("left", parseInt(curCovid.css("left")) + COVID_SPEED_X);
  if (parseInt(curCovid.css("top")) < -40 || 
      parseInt(curCovid.css("left")) < -40 ||
      parseInt(curCovid.css("top")) > maxPersonPosY + 30 || 
      parseInt(curCovid.css("left")) > maxPersonPosX + 30) {
    curCovid.remove();
  } 
}

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}

// Main Menu
function showPlayGame() {
  if (firstLoad == true) {
    showTutorial();
    firstLoad = false;
  }
  else {
    showSplash();
  }
}

function showSettings() {
  $('.settings-popup').show();
  $('.settings-popup').css('display', 'flex');
}

function closeSettings() {
  $('.settings-popup').hide();
}

function setDiff(diff) {
  diffLevel = diff;
  if (diff == 'easy') {
    $('#diff-normal').css({'border': '', 'border-color':''});
    $('#diff-hard').css({'border': '', 'border-color':''});
    $('#diff-easy').css({'border': '3px solid', 'border-color':'yellow'});
  }
  else if (diff == 'normal') {
    $('#diff-easy').css({'border': '', 'border-color':''});
    $('#diff-hard').css({'border': '', 'border-color':''});
    $('#diff-normal').css({'border': '3px solid', 'border-color':'yellow'});
  }
  else {
    $('#diff-normal').css({'border': '', 'border-color':''});
    $('#diff-easy').css({'border': '', 'border-color':''});
    $('#diff-hard').css({'border': '3px solid', 'border-color':'yellow'});
  }
}

function showTutorial() {
  $('.landing-page').hide();
  $('.tutorial').css('display', 'flex');
  $('.tutorial').show();
}

function showSplash() {
  $('.tutorial').hide();
  $('#actual_game').show().css('display', 'flex');
  $('.splashScreen').delay(3000).fadeOut('slow');
  // startGame(spawnCovid);
  startGame();
}

// showCovid(fireOne);
