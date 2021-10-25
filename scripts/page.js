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
let PERSON_SPEED = 10;                // Speed of the person
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
var spawnRate;

// Global Object Handles
var person;

// Counters
var covidIdx = 1;

// SCOREBOARD
let SCORE = 0;
var COVID_DANGER = 20;
var LEVEL = 1;
var diffIdx = 1;
let maskOn;
let GAME_OVER = false;

// functions

var shootingCov;
var shootingMask;
var shootingVacc;

// Sounds
var collectau = new Audio('./src/audio/collect.mp3');
var dieau = new Audio('./src/audio/die.mp3');

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
    // ====== Startup ====== 
    game_window = $('.game-window');
    
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
  GAME_OVER = false;
  maskOn = false;
  person = $('.person');

  person.append("<img id='player' style='top: 329px; left: 638px;' src='./src/player/player.gif'>").hide();
  person.delay(500).fadeIn();

  COVID_SPEED = 1;
  SCORE = 0;
  LEVEL = 1;

  $('#covid_danger_num').text(COVID_DANGER);
  $('#covid_level').text(LEVEL);
  $('#score_num').text('0');

  console.log("COVID_SPEED " + COVID_SPEED);
  console.log("SPAWN_RATE " + spawnRate);
  console.log("Difficulty " + diffLevel);
  
  // setTimeout(spawnCovid, 3500);
  spawnCovid();

  setInterval(function() {
    if (GAME_OVER === false) {
      $('#score_num').text(SCORE);
      SCORE = SCORE + 40;
    }
  }, 500);
}

function spawnCovid() {
  console.log('Spawning Covid...');
  console.log('Difficulty ' + diffLevel);

  shootingCov = setInterval(shootCovid, spawnRate);
  // shootMask every 15s, disappears every 5s
  shootingMask = setInterval(shootMask, maskOccurrence); //maskOccurrence
  // shootVacc every 20s, disappears every 5s
  shootingVacc = setInterval(shootVacc, vaccineOccurrence); // vaccineOccurrence
}

function shootCovid() {
  // determine starting point of new comet
  // move the comet every interval
  if (GAME_OVER === false) {
    console.log("shoot one comet");

    var corner = parseInt(getRandomNumber(1,5));
    var startX; 
    var startY;

    if (corner == 1) {
      // left
      startX = -40;
      startY = getRandomNumber(-40, maxPersonPosY + 40);
    }
    else if (corner == 2) {
      startX = maxPersonPosX + 40;
      startY = getRandomNumber(-40, maxPersonPosY + 40);
    }
    else if (corner == 3) {
      // down
      startY = maxPersonPosY + 40;
      startX = getRandomNumber(-40, maxPersonPosX + 40);
    }
    else {
      // up
      startY = -40;
      startX = getRandomNumber(-40, maxPersonPosX + 40);
    }

    var covidDiv = "<img src='./src/covidstriod.png' style='position: absolute; top:" + startY + "; left:" + startX + "; ' id='c-" + covidIdx + "'/>";

    $('.curAstroid').append(covidDiv);
    $(".curAstroid").fadeIn();

    var comet = "#c-" + covidIdx;

    var speedX = getSpeedX(comet);
    var speedY = getSpeedY(comet);
    
    const movingCovid = setInterval(function() {
      moveCovid(comet, speedX*diffIdx, speedY*diffIdx);
    }, AST_OBJECT_REFRESH_RATE); // AST_OBJECT_REFRESH_RATE move with the const val above

    if (GAME_OVER === true) {
      clearInterval(movingCovid);
    }

    covidIdx++; 
  }
  return;
}

function getSpeedX(comet) {
  var curCovid = $(comet);
  x = parseInt(curCovid.css("left"));

  if (x == -40) {
    // move down
    return COVID_SPEED;
  }
  else if (x > maxPersonPosX) {
    return -(COVID_SPEED);
  }
  // x is in between
  else if (x > maxPersonPosX/2) {
    return -(COVID_SPEED);
  }
  else {
    return COVID_SPEED;
  }
}

function getSpeedY(comet) {
  var curCovid = $(comet);
  y = parseInt(curCovid.css("top"));

  if (y == -40) {
    // move down
    return COVID_SPEED;
  }
  else if (y > maxPersonPosY) {
    return -(COVID_SPEED);
  }
  // y is in between
  else if (y > maxPersonPosY/2) {
    return -(COVID_SPEED);
  }
  else {
    return COVID_SPEED;
  }
}

function moveCovid(comet, COVID_SPEED_X, COVID_SPEED_Y) {
  if (GAME_OVER === false) {
    var curCovid = $(comet);
    
    curCovid.css("top", parseInt(curCovid.css("top")) + COVID_SPEED_Y);
    curCovid.css("left", parseInt(curCovid.css("left")) + COVID_SPEED_X);

    if (parseInt(curCovid.css("top")) <= -40|| 
        parseInt(curCovid.css("left")) <= -40 ||
        parseInt(curCovid.css("top")) >= maxPersonPosY + 40|| 
        parseInt(curCovid.css("left")) >= maxPersonPosX + 40) {
      curCovid.remove();
    } 

    if (isColliding(person, curCovid)) {
      console.log("hit");
      console.log("maskON ", + maskOn);
      if (maskOn === false) {
        // die!
        console.log("die")
        GAME_OVER = true;
        dieau.play(); 
        $('#player').attr({'src': './src/player/player_touched.gif'});
        person = null;
        setTimeout(function () {
          $('.person').empty();
          $('.curAstroid').empty();
          $('.curMask').empty();
          $('.curVacc').empty();
          $('#actual_game').hide();
          $('.landing-page').show();
          $('.landing-button').hide();
          $('.game-over-page').css('display', 'flex');
          $('#display-score').text(SCORE);
          clearInterval(shootingCov);
          clearInterval(shootingMask);
          clearInterval(shootingVacc);
        }, 2000);
      }
      else {
        $('#player').attr({'src': './src/player/player.gif'});
        setTimeout(function() {maskOn = false}, 500);
        return;
      }
    }
  }
}

function shootMask() {
  if (GAME_OVER === false) {
    console.log("Mask ...");

    var startmY = getRandomNumber(60, maxPersonPosY - 60);
    var startmX = getRandomNumber(60, maxPersonPosX - 60);
    var maskDiv = "<img src='./src/mask.gif' style='position: absolute; top:" + startmY + "; left:" + startmX + "; ' id='mask" + "'/>";
    $(".curMask").append(maskDiv).fadeIn();
    mask = $('#mask');
    setTimeout(function () {
      $("#mask").remove();
    }, maskGone);
  }
  return;
}

function shootVacc() {
  if (GAME_OVER === false) {
    console.log("Vaccine ...");

    var startvY = getRandomNumber(60, maxPersonPosY - 60);
    var startvX = getRandomNumber(60, maxPersonPosX - 60);
    var vaccDiv = "<img src='./src/vacc.gif' style='position: absolute; top:" + startvY + "; left:" + startvX + "; ' id='vacc" + "'/>";
    $(".curVacc").append(vaccDiv).fadeIn();
    vaccine = $('#vacc');
    setTimeout(function () {
      $("#vacc").remove();
    }, vaccineGone);
  }
  return;
}

// Person
function movePerson() {
  if (LEFT && UP) {
    var upPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (upPos < 0) {
      upPos = 0; 
    }
    var lPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (lPos < 0) {
      lPos = 0; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_up.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_up.gif');
    }
  }
  else if (LEFT && DOWN) {
    var upPos = parseInt(person.css("top")) + PERSON_MOVEMENT; 
    if (upPos > maxPersonPosY) {
      upPos = maxPersonPosY; 
    }
    var lPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (lPos < 0) {
      lPos = 0; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_down.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_down.gif');
    }
  }
  else if (RIGHT && UP) {
    var upPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (upPos < 0) {
      upPos = 0; 
    }
    var lPos = parseInt(person.css("left")) + PERSON_MOVEMENT; 
    if (lPos > maxPersonPosX) {
      lPos = maxPersonPosX; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_up.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_up.gif');
    }
  }
  else if (RIGHT && DOWN) {
    var upPos = parseInt(person.css("top")) + PERSON_MOVEMENT; 
    if (upPos > maxPersonPosY) {
      upPos = maxPersonPosY; 
    }
    var lPos = parseInt(person.css("left")) + PERSON_MOVEMENT; 
    if (lPos > maxPersonPosX) {
      lPos = maxPersonPosX; 
    }
    person.css({'left': lPos, 'top': upPos}); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_down.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_down.gif');
    }
  }
  else if (LEFT) {
    var newPos = parseInt(person.css("left")) - PERSON_MOVEMENT; 
    if (newPos < 0) {
      newPos = 0; 
    }
    person.css("left", newPos); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_left.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_left.gif');
    }
  }
  else if (UP) {
    var newPos = parseInt(person.css("top")) - PERSON_MOVEMENT; 
    if (newPos < 0) {
      newPos = 0; 
    }
    person.css("top", newPos)
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_up.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_up.gif');
    }
  }
  else if (DOWN) {
    var newPos = parseInt(person.css("top")) + PERSON_MOVEMENT;
    if (newPos > maxPersonPosY) {
      newPos = maxPersonPosY; 
    }
    person.css("top", newPos); 
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_down.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_down.gif');
    }
  }
  else if (RIGHT) {
    var newPos = parseInt(person.css("left")) + PERSON_MOVEMENT;
    if (newPos > maxPersonPosX) {
      newPos = maxPersonPosX; 
    }
    person.css("left", newPos);
    if (maskOn === false) {
      $('#player').attr('src', './src/player/player_right.gif');
    }
    else {
      $('#player').attr('src', './src/player/player_masked_right.gif');
    }
  }
  if (typeof mask !== 'undefined') {
    if (isColliding(mask, person)) {
      // wear mask
      console.log("mask hit!!!!!");
      collectau.play();
      maskOn = true;
      // $(".curMask").empty();
      mask.remove();
      $('#player').attr('src', './src/player/player_masked.gif');
    }
  }
  if (typeof vaccine !== 'undefined') {
    if (isColliding(vaccine, person)) {
      console.log("Vacc hit!!!");
      collectau.play();
      $(".curVacc").empty();
      ++LEVEL;
      COVID_SPEED = COVID_SPEED + (0.2 * diffIdx);
      COVID_DANGER = COVID_DANGER + 2;
      $('#covid_level').text(LEVEL);
      $('#covid_danger_num').text(COVID_DANGER);
    }
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
  if (firstLoad === true) {
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
  else if (diff == 'hard') {
    $('#diff-normal').css({'border': '', 'border-color':''});
    $('#diff-easy').css({'border': '', 'border-color':''});
    $('#diff-hard').css({'border': '3px solid', 'border-color':'yellow'});
  }
  else {
    $('#diff-easy').css({'border': '', 'border-color':''});
    $('#diff-normal').css({'border': '3px solid', 'border-color':'yellow'});
    $('#diff-hard').css({'border': '', 'border-color':''});
  }
}

function showTutorial() {
  $('.landing-page').hide();
  $('.tutorial').css('display', 'flex');
  $('.tutorial').show();
}

function showSplash() {
  console.log("Volume" + volLev);
  dieau.volume = volLev/100;
  collectau.volume = volLev/100;
  $('.tutorial').hide();
  $('.landing-page').hide();
  $('#actual_game').show().css('display', 'flex');
  $('.splashScreen').show();
  $('.splashScreen').delay(3000).fadeOut('slow');
  $('#covid_level').text(LEVEL);
  $('#score_num').text('0');
  if (diffLevel === 'easy') {
    spawnRate= 1000;
    diffIdx = 1;
    COVID_DANGER = 10;
  }
  else if (diffLevel === 'normal') {
    spawnRate = 800;
    diffIdx = 3;
    COVID_DANGER = 20;
  }
  else {
    spawnRate = 600;
    diffIdx = 5;
    COVID_DANGER = 30;
  }
  $('#covid_danger_num').text(COVID_DANGER);

  setTimeout(startGame, 3000);
  if (GAME_OVER === true) {
    return;
  }
}

function startOver() {
  // go back to landing page
  $('.landing-page').show();
  $('.landing-button').show();
  $('.game-over-page').css('display', 'none');
  LEVEL = 1; SCORE = 0; COVID_SPEED = 1;
}

function setVolume() {
  var slider = document.getElementById("vol-range");
  var output = document.getElementById("setVol");
  output.innerHTML = slider.value;
  volLev = slider.value;
}