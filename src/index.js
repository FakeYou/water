'use strict';

var simplexNoise = new SimplexNoise();
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var image = context.createImageData(width, height);
var data = image.data;

var counter = 0;
var levels = 16;

setInterval(function() {
  counter += 0;

  for(var x = 0; x < width; x++) {
    for(var y = 0; y < height; y++) {
      var n = simplexNoise.noise3D(x / 256, y / 256, counter / 128);

      // normalize
      n = (n + 1) / 2;
      n = Math.round(n * levels);

      var color = Math.round(n * 256) / levels;

      var index = (x + y * canvas.width) * 4;
      data[index + 0] = color; // r
      data[index + 1] = color; // g
      data[index + 2] = color; // b
      data[index + 3] = 255;   // a
    }
  }

  context.putImageData(image, 0, 0);
}, 500);
