(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// Called by processScores.js
module.exports = function (results, racerPositions) {
  var getSupportedPropertyName = require('./getSupportedPropertyName');
  var getPosition = require('./getPosition');

  var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
  var transformProperty = getSupportedPropertyName(transform);

  var team_1_item = document.getElementById('team-1');
  var team_2_item = document.getElementById('team-2');
  var team_3_item = document.getElementById('team-3');
  var team_4_item = document.getElementById('team-4');
  var teamItems = [
    team_1_item,
    team_2_item,
    team_3_item,
    team_4_item
  ];
  var team_score_1 = document.getElementById('team-score-1');
  var team_score_2 = document.getElementById('team-score-2');
  var team_score_3 = document.getElementById('team-score-3');
  var team_score_4 = document.getElementById('team-score-4');
  var teamScores = [
    team_score_1,
    team_score_2,
    team_score_3,
    team_score_4
  ];
  var team_score_block_1 = document.getElementById('team-score-block-1');
  var team_score_block_2 = document.getElementById('team-score-block-2');
  var team_score_block_3 = document.getElementById('team-score-block-3');
  var team_score_block_4 = document.getElementById('team-score-block-4');
  var teamScoreBlocks = [
    team_score_block_1,
    team_score_block_2,
    team_score_block_3,
    team_score_block_4
  ];
  var rank_team_1 = document.getElementById('rank-team-1');
  var rank_team_2 = document.getElementById('rank-team-2');
  var rank_team_3 = document.getElementById('rank-team-3');
  var rank_team_4 = document.getElementById('rank-team-4');
  var teamRanks = [
    rank_team_1,
    rank_team_2,
    rank_team_3,
    rank_team_4
  ];
  var ranks = [
    '4<span>th</span>',
    '3<span>rd</span>',
    '2<span>nd</span>',
    '1<span>st</span>'
  ];

  var totalScoreDiv = document.getElementById('totalScore');

  for (var i=0; i < racerPositions.length; i++) {
    // Set the position vertically of the 'car'
    var y = racerPositions[i] + '%';
    if (transformProperty) {
      teamItems[i].style[transformProperty] = 'translate3d(0, ' + y + ', 0)';
    }
    // Add Total pops and players to the header.
    totalScoreDiv.innerHTML = `
      <li>
        <strong>Total pops: </strong>${results.pops.reduce( (prev, curr) => prev + curr )}
      </li>
      <li>
        <strong>Total players: </strong>${results.players.reduce( (prev, curr) => prev + curr )}
      </li>
    `;
    // Add the score to the header. Add pops and players to team score card
    teamScoreBlocks[i].innerHTML = `
      <strong id="team-score-${i}">${results.scores[i]}</strong>
      <ul>
        <li>
          <strong>Pops: </strong>${results.pops[i]}
        </li>
        <li>
          <strong>Players: </strong>${results.players[i]}
        </li>
      </ul>
    `;
    // Find the position / rank for each team.
    var rankindex = getPosition(i, results.scores);
    // Based on the rank add the 'place' (1st,2nd,3rd,4th) to each 'car'.
    teamRanks[i].innerHTML = ranks[rankindex];
    // Add 'glow' to the current leader and remove it from the others.
    if (rankindex === 3) {
      teamItems[i].classList.add('winner');
      teamScoreBlocks[i].classList.add('winner');
    } else {
      teamItems[i].classList.remove('winner');
      teamScoreBlocks[i].classList.remove('winner');
    }
  }
};

},{"./getPosition":3,"./getSupportedPropertyName":5}],2:[function(require,module,exports){
'use strict';

// Called by processScores.js, getPosition.js
module.exports = function (values) {
  var insertionSort = require('./insertionSort');

  var total = 0;
  var screenMaxPercentSize = 75;
  var scorePercentages = [];
  var sortedScorePercentages;
  var highestScorePercentage;

  var invertedPercentagesScores = [];
  var sortedInvertedPercentagesScores;
  var highestInvertedPercentagesScore;
  var baseOffset = 0;
  var scoreMultiplier;

  var scoreSpread = [];
  var i;


  // Total up all the scores
  for (i=0; i < values.length; i++) {
    total += values[i];
  }

  // Find the percentage for each score
  for (i=0; i < values.length; i++) {
    scorePercentages[i] = (values[i] / total) * 100;
  }

  // Clone the array
  sortedScorePercentages = scorePercentages.slice(0);

  // sort the array
  insertionSort(sortedScorePercentages, 0, sortedScorePercentages.length - 1);

  // Invert the percentages for the scores since 0 is highest in the UI
  // Find the highest number
  highestScorePercentage = sortedScorePercentages[sortedScorePercentages.length - 1];

  // Subtract all the numbers from the highest (highest - n)
  for(i=0; i < scorePercentages.length; i++) {
    invertedPercentagesScores[i] = highestScorePercentage - scorePercentages[i];
  }

  // Spread all scores across screen-size(75)
  // clone the array
  sortedInvertedPercentagesScores = invertedPercentagesScores.slice(0);
  // sort the array
  insertionSort(sortedInvertedPercentagesScores, 0, sortedInvertedPercentagesScores.length - 1);
  // Find the highest (this will be the lowest score but highest value) from new array
  highestInvertedPercentagesScore = sortedInvertedPercentagesScores[sortedInvertedPercentagesScores.length - 1];

  // Add base-offset(5) to lowest to get spread-multiplier
  scoreMultiplier = screenMaxPercentSize/ (highestInvertedPercentagesScore + baseOffset);

  // Multiply each value in inverted array by spread-multiplier
  for(i=0; i < invertedPercentagesScores.length; i++) {
    scoreSpread[i] = scoreMultiplier * invertedPercentagesScores[i];
  }

  return scoreSpread;
};
},{"./insertionSort":6}],3:[function(require,module,exports){
'use strict';

// Called by applyScoresToUI.js
module.exports = function (racerPosition, scores) {
  var insertionSort = require('./insertionSort');
  var sortedScores = [];
  var rankIndex;

  // Copy the array so that we aren't modifying the original.
  sortedScores = scores.slice(0);
  // Sort the scores in ascending order.
//  sortedScores.sort(function(a, b){return a-b}); //standard JS way to sort
  insertionSort(sortedScores, 0, sortedScores.length - 1); //my way, just because I can
  // Now that we know the ascending order of the scores,
  // get the index of the first element in the array that has a value of scores[i] or more.
  // The findIndex function passes each element of the array one at a time. 
  // It stops looking after it finds a match.
  rankIndex = sortedScores.findIndex(function(sortedScore){return sortedScore>=scores[racerPosition]});

  return rankIndex;
};
},{"./insertionSort":6}],4:[function(require,module,exports){
'use strict';

// Called by main.js
module.exports = function (results, racerPositions) {
  var processScores = require('./processScores');
  // TODO: remove when live
/*
  var scoreGen = require('./scoreGen');
  results.scores = scoreGen(results.scores);
  var pp = 0, pl = 0;
  for (var i = 0; i < 4; i++) {
    pp = pp + (1 + i) * 5;
    pl = pl + (1 + i) * 2;
    results.pops[i] = pp;
    results.players[i] = pl;
  }
  processScores(results, racerPositions);
*/

/*
  var scores = new Array(4);
  scores[0] = 1;
  scores[1] = 1;
  scores[2] = 1;
  scores[3] = 1;
*/

  // declare websocket
  var ws = new WebSocket('ws://game-boards.forum.apps.redhatforum.co.uk/scoreboard');

  ws.onopen = event => {
    // console.log(event);
  };

  ws.onmessage = event => {
    console.log(event);
    let message = JSON.parse(event.data);

    for (var i = 0; i < message.length; i++) {
      results.scores[i] = message[i].score;
      results.pops[i] = message[i].numPops;
      results.players[i] = message[i].numPlayers;
    }

    processScores(results, racerPositions);
  };

  return results;

};

},{"./processScores":8}],5:[function(require,module,exports){
'use strict';

// Called by applyScoresToUI.js
module.exports = function (properties) {
  for (var i = 0; i < properties.length; i++) {
    if (typeof document.body.style[properties[i]] != "undefined") {
      return properties[i];
    }
  }
  return null;
};
},{}],6:[function(require,module,exports){
'use strict';

// Called by convertScores.js
module.exports = function (array, left, right) {
  function less(v, w) {
    return v < w;
  }
  function exch(a,i,j) {
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  function compExch(a,i,j) {
    if (less(a[j], a[i])) exch(a,i,j);
  }

  var i;
  for(i = right; i > left; i--) {
    compExch(array, i-1, i);
  }
  for(i = left + 2; i <= right; i++) {
    var j = i;
    var v = array[i];
    while (less(v,array[j-1])) {
      array[j] = array[j-1];
      j--;
    }
    array[j] = v;
  }
};
},{}],7:[function(require,module,exports){
'use strict';

//imports
var getScores = require('./getScores');

var scores = [1,1,1,1];
var pops = [1,1,1,1];
var players = [1,1,1,1];
var racerPositions = [1,1,1,1];
var results = {scores, pops, players};

function run() {
  results = getScores(results, racerPositions);
}

run();

/*
// Start the app by repeatedly fetching and processing the Scores.
var timer = setInterval(run, 500);

// TODO: turn this off when running with live data
setTimeout(function() {clearInterval(timer)}, 30000);
*/

},{"./getScores":4}],8:[function(require,module,exports){
'use strict';

// Called by getScores.js
module.exports = function (results, racerPositions) {
  var convertScores = require('./convertScores');
  var applyScoresToUI = require('./applyScoresToUI');

  // Convert the raw scores into the UI position information needed.
  racerPositions = convertScores(results.scores);
  
  applyScoresToUI(results, racerPositions);
};
},{"./applyScoresToUI":1,"./convertScores":2}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL2FwcGx5U2NvcmVzVG9VSS5qcyIsImpzL2NvbnZlcnRTY29yZXMuanMiLCJqcy9nZXRQb3NpdGlvbi5qcyIsImpzL2dldFNjb3Jlcy5qcyIsImpzL2dldFN1cHBvcnRlZFByb3BlcnR5TmFtZS5qcyIsImpzL2luc2VydGlvblNvcnQuanMiLCJqcy9tYWluLmpzIiwianMvcHJvY2Vzc1Njb3Jlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8vIENhbGxlZCBieSBwcm9jZXNzU2NvcmVzLmpzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXN1bHRzLCByYWNlclBvc2l0aW9ucykge1xuICB2YXIgZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lID0gcmVxdWlyZSgnLi9nZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUnKTtcbiAgdmFyIGdldFBvc2l0aW9uID0gcmVxdWlyZSgnLi9nZXRQb3NpdGlvbicpO1xuXG4gIHZhciB0cmFuc2Zvcm0gPSBbXCJ0cmFuc2Zvcm1cIiwgXCJtc1RyYW5zZm9ybVwiLCBcIndlYmtpdFRyYW5zZm9ybVwiLCBcIm1velRyYW5zZm9ybVwiLCBcIm9UcmFuc2Zvcm1cIl07XG4gIHZhciB0cmFuc2Zvcm1Qcm9wZXJ0eSA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSh0cmFuc2Zvcm0pO1xuXG4gIHZhciB0ZWFtXzFfaXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLTEnKTtcbiAgdmFyIHRlYW1fMl9pdGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tMicpO1xuICB2YXIgdGVhbV8zX2l0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVhbS0zJyk7XG4gIHZhciB0ZWFtXzRfaXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLTQnKTtcbiAgdmFyIHRlYW1JdGVtcyA9IFtcbiAgICB0ZWFtXzFfaXRlbSxcbiAgICB0ZWFtXzJfaXRlbSxcbiAgICB0ZWFtXzNfaXRlbSxcbiAgICB0ZWFtXzRfaXRlbVxuICBdO1xuICB2YXIgdGVhbV9zY29yZV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tc2NvcmUtMScpO1xuICB2YXIgdGVhbV9zY29yZV8yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tc2NvcmUtMicpO1xuICB2YXIgdGVhbV9zY29yZV8zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tc2NvcmUtMycpO1xuICB2YXIgdGVhbV9zY29yZV80ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tc2NvcmUtNCcpO1xuICB2YXIgdGVhbVNjb3JlcyA9IFtcbiAgICB0ZWFtX3Njb3JlXzEsXG4gICAgdGVhbV9zY29yZV8yLFxuICAgIHRlYW1fc2NvcmVfMyxcbiAgICB0ZWFtX3Njb3JlXzRcbiAgXTtcbiAgdmFyIHRlYW1fc2NvcmVfYmxvY2tfMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLXNjb3JlLWJsb2NrLTEnKTtcbiAgdmFyIHRlYW1fc2NvcmVfYmxvY2tfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLXNjb3JlLWJsb2NrLTInKTtcbiAgdmFyIHRlYW1fc2NvcmVfYmxvY2tfMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLXNjb3JlLWJsb2NrLTMnKTtcbiAgdmFyIHRlYW1fc2NvcmVfYmxvY2tfNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFtLXNjb3JlLWJsb2NrLTQnKTtcbiAgdmFyIHRlYW1TY29yZUJsb2NrcyA9IFtcbiAgICB0ZWFtX3Njb3JlX2Jsb2NrXzEsXG4gICAgdGVhbV9zY29yZV9ibG9ja18yLFxuICAgIHRlYW1fc2NvcmVfYmxvY2tfMyxcbiAgICB0ZWFtX3Njb3JlX2Jsb2NrXzRcbiAgXTtcbiAgdmFyIHJhbmtfdGVhbV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmstdGVhbS0xJyk7XG4gIHZhciByYW5rX3RlYW1fMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5rLXRlYW0tMicpO1xuICB2YXIgcmFua190ZWFtXzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuay10ZWFtLTMnKTtcbiAgdmFyIHJhbmtfdGVhbV80ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmstdGVhbS00Jyk7XG4gIHZhciB0ZWFtUmFua3MgPSBbXG4gICAgcmFua190ZWFtXzEsXG4gICAgcmFua190ZWFtXzIsXG4gICAgcmFua190ZWFtXzMsXG4gICAgcmFua190ZWFtXzRcbiAgXTtcbiAgdmFyIHJhbmtzID0gW1xuICAgICc0PHNwYW4+dGg8L3NwYW4+JyxcbiAgICAnMzxzcGFuPnJkPC9zcGFuPicsXG4gICAgJzI8c3Bhbj5uZDwvc3Bhbj4nLFxuICAgICcxPHNwYW4+c3Q8L3NwYW4+J1xuICBdO1xuXG4gIHZhciB0b3RhbFNjb3JlRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsU2NvcmUnKTtcblxuICBmb3IgKHZhciBpPTA7IGkgPCByYWNlclBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIFNldCB0aGUgcG9zaXRpb24gdmVydGljYWxseSBvZiB0aGUgJ2NhcidcbiAgICB2YXIgeSA9IHJhY2VyUG9zaXRpb25zW2ldICsgJyUnO1xuICAgIGlmICh0cmFuc2Zvcm1Qcm9wZXJ0eSkge1xuICAgICAgdGVhbUl0ZW1zW2ldLnN0eWxlW3RyYW5zZm9ybVByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgwLCAnICsgeSArICcsIDApJztcbiAgICB9XG4gICAgLy8gQWRkIFRvdGFsIHBvcHMgYW5kIHBsYXllcnMgdG8gdGhlIGhlYWRlci5cbiAgICB0b3RhbFNjb3JlRGl2LmlubmVySFRNTCA9IGBcbiAgICAgIDxsaT5cbiAgICAgICAgPHN0cm9uZz5Ub3RhbCBwb3BzOiA8L3N0cm9uZz4ke3Jlc3VsdHMucG9wcy5yZWR1Y2UoIChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3VyciApfVxuICAgICAgPC9saT5cbiAgICAgIDxsaT5cbiAgICAgICAgPHN0cm9uZz5Ub3RhbCBwbGF5ZXJzOiA8L3N0cm9uZz4ke3Jlc3VsdHMucGxheWVycy5yZWR1Y2UoIChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3VyciApfVxuICAgICAgPC9saT5cbiAgICBgO1xuICAgIC8vIEFkZCB0aGUgc2NvcmUgdG8gdGhlIGhlYWRlci4gQWRkIHBvcHMgYW5kIHBsYXllcnMgdG8gdGVhbSBzY29yZSBjYXJkXG4gICAgdGVhbVNjb3JlQmxvY2tzW2ldLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHJvbmcgaWQ9XCJ0ZWFtLXNjb3JlLSR7aX1cIj4ke3Jlc3VsdHMuc2NvcmVzW2ldfTwvc3Ryb25nPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPHN0cm9uZz5Qb3BzOiA8L3N0cm9uZz4ke3Jlc3VsdHMucG9wc1tpXX1cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxzdHJvbmc+UGxheWVyczogPC9zdHJvbmc+JHtyZXN1bHRzLnBsYXllcnNbaV19XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIGA7XG4gICAgLy8gRmluZCB0aGUgcG9zaXRpb24gLyByYW5rIGZvciBlYWNoIHRlYW0uXG4gICAgdmFyIHJhbmtpbmRleCA9IGdldFBvc2l0aW9uKGksIHJlc3VsdHMuc2NvcmVzKTtcbiAgICAvLyBCYXNlZCBvbiB0aGUgcmFuayBhZGQgdGhlICdwbGFjZScgKDFzdCwybmQsM3JkLDR0aCkgdG8gZWFjaCAnY2FyJy5cbiAgICB0ZWFtUmFua3NbaV0uaW5uZXJIVE1MID0gcmFua3NbcmFua2luZGV4XTtcbiAgICAvLyBBZGQgJ2dsb3cnIHRvIHRoZSBjdXJyZW50IGxlYWRlciBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIG90aGVycy5cbiAgICBpZiAocmFua2luZGV4ID09PSAzKSB7XG4gICAgICB0ZWFtSXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnd2lubmVyJyk7XG4gICAgICB0ZWFtU2NvcmVCbG9ja3NbaV0uY2xhc3NMaXN0LmFkZCgnd2lubmVyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlYW1JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5uZXInKTtcbiAgICAgIHRlYW1TY29yZUJsb2Nrc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5uZXInKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIENhbGxlZCBieSBwcm9jZXNzU2NvcmVzLmpzLCBnZXRQb3NpdGlvbi5qc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gIHZhciBpbnNlcnRpb25Tb3J0ID0gcmVxdWlyZSgnLi9pbnNlcnRpb25Tb3J0Jyk7XG5cbiAgdmFyIHRvdGFsID0gMDtcbiAgdmFyIHNjcmVlbk1heFBlcmNlbnRTaXplID0gNzU7XG4gIHZhciBzY29yZVBlcmNlbnRhZ2VzID0gW107XG4gIHZhciBzb3J0ZWRTY29yZVBlcmNlbnRhZ2VzO1xuICB2YXIgaGlnaGVzdFNjb3JlUGVyY2VudGFnZTtcblxuICB2YXIgaW52ZXJ0ZWRQZXJjZW50YWdlc1Njb3JlcyA9IFtdO1xuICB2YXIgc29ydGVkSW52ZXJ0ZWRQZXJjZW50YWdlc1Njb3JlcztcbiAgdmFyIGhpZ2hlc3RJbnZlcnRlZFBlcmNlbnRhZ2VzU2NvcmU7XG4gIHZhciBiYXNlT2Zmc2V0ID0gMDtcbiAgdmFyIHNjb3JlTXVsdGlwbGllcjtcblxuICB2YXIgc2NvcmVTcHJlYWQgPSBbXTtcbiAgdmFyIGk7XG5cblxuICAvLyBUb3RhbCB1cCBhbGwgdGhlIHNjb3Jlc1xuICBmb3IgKGk9MDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIHRvdGFsICs9IHZhbHVlc1tpXTtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHBlcmNlbnRhZ2UgZm9yIGVhY2ggc2NvcmVcbiAgZm9yIChpPTA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBzY29yZVBlcmNlbnRhZ2VzW2ldID0gKHZhbHVlc1tpXSAvIHRvdGFsKSAqIDEwMDtcbiAgfVxuXG4gIC8vIENsb25lIHRoZSBhcnJheVxuICBzb3J0ZWRTY29yZVBlcmNlbnRhZ2VzID0gc2NvcmVQZXJjZW50YWdlcy5zbGljZSgwKTtcblxuICAvLyBzb3J0IHRoZSBhcnJheVxuICBpbnNlcnRpb25Tb3J0KHNvcnRlZFNjb3JlUGVyY2VudGFnZXMsIDAsIHNvcnRlZFNjb3JlUGVyY2VudGFnZXMubGVuZ3RoIC0gMSk7XG5cbiAgLy8gSW52ZXJ0IHRoZSBwZXJjZW50YWdlcyBmb3IgdGhlIHNjb3JlcyBzaW5jZSAwIGlzIGhpZ2hlc3QgaW4gdGhlIFVJXG4gIC8vIEZpbmQgdGhlIGhpZ2hlc3QgbnVtYmVyXG4gIGhpZ2hlc3RTY29yZVBlcmNlbnRhZ2UgPSBzb3J0ZWRTY29yZVBlcmNlbnRhZ2VzW3NvcnRlZFNjb3JlUGVyY2VudGFnZXMubGVuZ3RoIC0gMV07XG5cbiAgLy8gU3VidHJhY3QgYWxsIHRoZSBudW1iZXJzIGZyb20gdGhlIGhpZ2hlc3QgKGhpZ2hlc3QgLSBuKVxuICBmb3IoaT0wOyBpIDwgc2NvcmVQZXJjZW50YWdlcy5sZW5ndGg7IGkrKykge1xuICAgIGludmVydGVkUGVyY2VudGFnZXNTY29yZXNbaV0gPSBoaWdoZXN0U2NvcmVQZXJjZW50YWdlIC0gc2NvcmVQZXJjZW50YWdlc1tpXTtcbiAgfVxuXG4gIC8vIFNwcmVhZCBhbGwgc2NvcmVzIGFjcm9zcyBzY3JlZW4tc2l6ZSg3NSlcbiAgLy8gY2xvbmUgdGhlIGFycmF5XG4gIHNvcnRlZEludmVydGVkUGVyY2VudGFnZXNTY29yZXMgPSBpbnZlcnRlZFBlcmNlbnRhZ2VzU2NvcmVzLnNsaWNlKDApO1xuICAvLyBzb3J0IHRoZSBhcnJheVxuICBpbnNlcnRpb25Tb3J0KHNvcnRlZEludmVydGVkUGVyY2VudGFnZXNTY29yZXMsIDAsIHNvcnRlZEludmVydGVkUGVyY2VudGFnZXNTY29yZXMubGVuZ3RoIC0gMSk7XG4gIC8vIEZpbmQgdGhlIGhpZ2hlc3QgKHRoaXMgd2lsbCBiZSB0aGUgbG93ZXN0IHNjb3JlIGJ1dCBoaWdoZXN0IHZhbHVlKSBmcm9tIG5ldyBhcnJheVxuICBoaWdoZXN0SW52ZXJ0ZWRQZXJjZW50YWdlc1Njb3JlID0gc29ydGVkSW52ZXJ0ZWRQZXJjZW50YWdlc1Njb3Jlc1tzb3J0ZWRJbnZlcnRlZFBlcmNlbnRhZ2VzU2NvcmVzLmxlbmd0aCAtIDFdO1xuXG4gIC8vIEFkZCBiYXNlLW9mZnNldCg1KSB0byBsb3dlc3QgdG8gZ2V0IHNwcmVhZC1tdWx0aXBsaWVyXG4gIHNjb3JlTXVsdGlwbGllciA9IHNjcmVlbk1heFBlcmNlbnRTaXplLyAoaGlnaGVzdEludmVydGVkUGVyY2VudGFnZXNTY29yZSArIGJhc2VPZmZzZXQpO1xuXG4gIC8vIE11bHRpcGx5IGVhY2ggdmFsdWUgaW4gaW52ZXJ0ZWQgYXJyYXkgYnkgc3ByZWFkLW11bHRpcGxpZXJcbiAgZm9yKGk9MDsgaSA8IGludmVydGVkUGVyY2VudGFnZXNTY29yZXMubGVuZ3RoOyBpKyspIHtcbiAgICBzY29yZVNwcmVhZFtpXSA9IHNjb3JlTXVsdGlwbGllciAqIGludmVydGVkUGVyY2VudGFnZXNTY29yZXNbaV07XG4gIH1cblxuICByZXR1cm4gc2NvcmVTcHJlYWQ7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLy8gQ2FsbGVkIGJ5IGFwcGx5U2NvcmVzVG9VSS5qc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmFjZXJQb3NpdGlvbiwgc2NvcmVzKSB7XG4gIHZhciBpbnNlcnRpb25Tb3J0ID0gcmVxdWlyZSgnLi9pbnNlcnRpb25Tb3J0Jyk7XG4gIHZhciBzb3J0ZWRTY29yZXMgPSBbXTtcbiAgdmFyIHJhbmtJbmRleDtcblxuICAvLyBDb3B5IHRoZSBhcnJheSBzbyB0aGF0IHdlIGFyZW4ndCBtb2RpZnlpbmcgdGhlIG9yaWdpbmFsLlxuICBzb3J0ZWRTY29yZXMgPSBzY29yZXMuc2xpY2UoMCk7XG4gIC8vIFNvcnQgdGhlIHNjb3JlcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4vLyAgc29ydGVkU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYil7cmV0dXJuIGEtYn0pOyAvL3N0YW5kYXJkIEpTIHdheSB0byBzb3J0XG4gIGluc2VydGlvblNvcnQoc29ydGVkU2NvcmVzLCAwLCBzb3J0ZWRTY29yZXMubGVuZ3RoIC0gMSk7IC8vbXkgd2F5LCBqdXN0IGJlY2F1c2UgSSBjYW5cbiAgLy8gTm93IHRoYXQgd2Uga25vdyB0aGUgYXNjZW5kaW5nIG9yZGVyIG9mIHRoZSBzY29yZXMsXG4gIC8vIGdldCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGFycmF5IHRoYXQgaGFzIGEgdmFsdWUgb2Ygc2NvcmVzW2ldIG9yIG1vcmUuXG4gIC8vIFRoZSBmaW5kSW5kZXggZnVuY3Rpb24gcGFzc2VzIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXkgb25lIGF0IGEgdGltZS4gXG4gIC8vIEl0IHN0b3BzIGxvb2tpbmcgYWZ0ZXIgaXQgZmluZHMgYSBtYXRjaC5cbiAgcmFua0luZGV4ID0gc29ydGVkU2NvcmVzLmZpbmRJbmRleChmdW5jdGlvbihzb3J0ZWRTY29yZSl7cmV0dXJuIHNvcnRlZFNjb3JlPj1zY29yZXNbcmFjZXJQb3NpdGlvbl19KTtcblxuICByZXR1cm4gcmFua0luZGV4O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIENhbGxlZCBieSBtYWluLmpzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXN1bHRzLCByYWNlclBvc2l0aW9ucykge1xuICB2YXIgcHJvY2Vzc1Njb3JlcyA9IHJlcXVpcmUoJy4vcHJvY2Vzc1Njb3JlcycpO1xuICAvLyBUT0RPOiByZW1vdmUgd2hlbiBsaXZlXG4vKlxuICB2YXIgc2NvcmVHZW4gPSByZXF1aXJlKCcuL3Njb3JlR2VuJyk7XG4gIHJlc3VsdHMuc2NvcmVzID0gc2NvcmVHZW4ocmVzdWx0cy5zY29yZXMpO1xuICB2YXIgcHAgPSAwLCBwbCA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgcHAgPSBwcCArICgxICsgaSkgKiA1O1xuICAgIHBsID0gcGwgKyAoMSArIGkpICogMjtcbiAgICByZXN1bHRzLnBvcHNbaV0gPSBwcDtcbiAgICByZXN1bHRzLnBsYXllcnNbaV0gPSBwbDtcbiAgfVxuICBwcm9jZXNzU2NvcmVzKHJlc3VsdHMsIHJhY2VyUG9zaXRpb25zKTtcbiovXG5cbi8qXG4gIHZhciBzY29yZXMgPSBuZXcgQXJyYXkoNCk7XG4gIHNjb3Jlc1swXSA9IDE7XG4gIHNjb3Jlc1sxXSA9IDE7XG4gIHNjb3Jlc1syXSA9IDE7XG4gIHNjb3Jlc1szXSA9IDE7XG4qL1xuXG4gIC8vIGRlY2xhcmUgd2Vic29ja2V0XG4gIHZhciB3cyA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vZ2FtZS1ib2FyZHMuZm9ydW0uYXBwcy5yZWRoYXRmb3J1bS5jby51ay9zY29yZWJvYXJkJyk7XG5cbiAgd3Mub25vcGVuID0gZXZlbnQgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgfTtcblxuICB3cy5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgIGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVzc2FnZS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0cy5zY29yZXNbaV0gPSBtZXNzYWdlW2ldLnNjb3JlO1xuICAgICAgcmVzdWx0cy5wb3BzW2ldID0gbWVzc2FnZVtpXS5udW1Qb3BzO1xuICAgICAgcmVzdWx0cy5wbGF5ZXJzW2ldID0gbWVzc2FnZVtpXS5udW1QbGF5ZXJzO1xuICAgIH1cblxuICAgIHByb2Nlc3NTY29yZXMocmVzdWx0cywgcmFjZXJQb3NpdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiByZXN1bHRzO1xuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBDYWxsZWQgYnkgYXBwbHlTY29yZXNUb1VJLmpzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVtwcm9wZXJ0aWVzW2ldXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gcHJvcGVydGllc1tpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLy8gQ2FsbGVkIGJ5IGNvbnZlcnRTY29yZXMuanNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFycmF5LCBsZWZ0LCByaWdodCkge1xuICBmdW5jdGlvbiBsZXNzKHYsIHcpIHtcbiAgICByZXR1cm4gdiA8IHc7XG4gIH1cbiAgZnVuY3Rpb24gZXhjaChhLGksaikge1xuICAgIHZhciB0ID0gYVtpXTtcbiAgICBhW2ldID0gYVtqXTtcbiAgICBhW2pdID0gdDtcbiAgfVxuICBmdW5jdGlvbiBjb21wRXhjaChhLGksaikge1xuICAgIGlmIChsZXNzKGFbal0sIGFbaV0pKSBleGNoKGEsaSxqKTtcbiAgfVxuXG4gIHZhciBpO1xuICBmb3IoaSA9IHJpZ2h0OyBpID4gbGVmdDsgaS0tKSB7XG4gICAgY29tcEV4Y2goYXJyYXksIGktMSwgaSk7XG4gIH1cbiAgZm9yKGkgPSBsZWZ0ICsgMjsgaSA8PSByaWdodDsgaSsrKSB7XG4gICAgdmFyIGogPSBpO1xuICAgIHZhciB2ID0gYXJyYXlbaV07XG4gICAgd2hpbGUgKGxlc3ModixhcnJheVtqLTFdKSkge1xuICAgICAgYXJyYXlbal0gPSBhcnJheVtqLTFdO1xuICAgICAgai0tO1xuICAgIH1cbiAgICBhcnJheVtqXSA9IHY7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vL2ltcG9ydHNcbnZhciBnZXRTY29yZXMgPSByZXF1aXJlKCcuL2dldFNjb3JlcycpO1xuXG52YXIgc2NvcmVzID0gWzEsMSwxLDFdO1xudmFyIHBvcHMgPSBbMSwxLDEsMV07XG52YXIgcGxheWVycyA9IFsxLDEsMSwxXTtcbnZhciByYWNlclBvc2l0aW9ucyA9IFsxLDEsMSwxXTtcbnZhciByZXN1bHRzID0ge3Njb3JlcywgcG9wcywgcGxheWVyc307XG5cbmZ1bmN0aW9uIHJ1bigpIHtcbiAgcmVzdWx0cyA9IGdldFNjb3JlcyhyZXN1bHRzLCByYWNlclBvc2l0aW9ucyk7XG59XG5cbnJ1bigpO1xuXG4vKlxuLy8gU3RhcnQgdGhlIGFwcCBieSByZXBlYXRlZGx5IGZldGNoaW5nIGFuZCBwcm9jZXNzaW5nIHRoZSBTY29yZXMuXG52YXIgdGltZXIgPSBzZXRJbnRlcnZhbChydW4sIDUwMCk7XG5cbi8vIFRPRE86IHR1cm4gdGhpcyBvZmYgd2hlbiBydW5uaW5nIHdpdGggbGl2ZSBkYXRhXG5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2NsZWFySW50ZXJ2YWwodGltZXIpfSwgMzAwMDApO1xuKi9cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gQ2FsbGVkIGJ5IGdldFNjb3Jlcy5qc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVzdWx0cywgcmFjZXJQb3NpdGlvbnMpIHtcbiAgdmFyIGNvbnZlcnRTY29yZXMgPSByZXF1aXJlKCcuL2NvbnZlcnRTY29yZXMnKTtcbiAgdmFyIGFwcGx5U2NvcmVzVG9VSSA9IHJlcXVpcmUoJy4vYXBwbHlTY29yZXNUb1VJJyk7XG5cbiAgLy8gQ29udmVydCB0aGUgcmF3IHNjb3JlcyBpbnRvIHRoZSBVSSBwb3NpdGlvbiBpbmZvcm1hdGlvbiBuZWVkZWQuXG4gIHJhY2VyUG9zaXRpb25zID0gY29udmVydFNjb3JlcyhyZXN1bHRzLnNjb3Jlcyk7XG4gIFxuICBhcHBseVNjb3Jlc1RvVUkocmVzdWx0cywgcmFjZXJQb3NpdGlvbnMpO1xufTsiXX0=
