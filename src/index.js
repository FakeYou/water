'use strict';

var FastSimplexNoise = require('fast-simplex-noise');

var noise = new FastSimplexNoise({ frequency: 0.005, octaves: 4 });

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

var step = 8;
var levels = 4;

var draw = function() {
  for(var x = 0; x < canvas.width; x += step) {
    for(var y = 0; y < canvas.height; y += step) {
      var height = noise.get3DNoise(x, y, Date.now() / 100);
      height = (height + 1) / 2;
      height = Math.round(height * levels);

      var shade = Math.round(height / levels * 255);

      context.fillStyle = 'rgb(' + shade + ',' + shade + ',' + shade + ')';
      context.fillRect(x, y, step, step);
    }
  }
  
  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);