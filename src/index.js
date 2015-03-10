'use strict';

var _ = require('underscore');

var simplify = require('./simplify');
var clipper = require('./clipper');

var simplexNoise = new SimplexNoise();
var voronoi = new Voronoi();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var levels = 15;

var boundingBox = {
  xl: 10,
  xr: width - 20,
  yt: 10,
  yb: height - 20, 
};

var sites = [];

for(var i = 0; i < 250; i++) {
  sites.push({
    x: Math.random() * width,
    y: Math.random() * height
  });
}

var diagram = voronoi.compute(sites, boundingBox);
window.diagram = diagram;

var counter = 0;

setInterval(function() {
  context.clearRect(0, 0, width, height);
  counter += 1;

  for(var i = 0; i < diagram.cells.length; i++) {
    var cell = diagram.cells[i];

    var n = simplexNoise.noise3D((cell.site.x + counter * 2) / 450, cell.site.y / 512, counter / 256);

    // normalize
    n = (n + 1) / 2;
    n = Math.round(n * levels);
    cell.height = n;
    cell.used = false;

    // var color = Math.round(cell.height / levels * 255);

    // context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
    // context.beginPath();

    // if(cell.halfedges.length === 0) {
    //   continue;
    // }

    // var start = cell.halfedges[0].getStartpoint();
    // context.moveTo(start.x, start.y);

    // for(var j = 0; j < cell.halfedges.length; j++) {
    //   var point = cell.halfedges[j].getEndpoint();
    //   context.lineTo(point.x, point.y);
    // }
    // context.closePath();
    // // context.stroke();
    // context.fill();
  }

  function getPolygon(cell) {
    var polygon = [];

    if(cell.halfedges.length === 0) {
      return [];
    }

    var start = cell.halfedges[0].getStartpoint();
    polygon.push(start);

    for(var j = 0; j < cell.halfedges.length; j++) {
      var point = cell.halfedges[j].getEndpoint();
      polygon.push(point);
    }

    return polygon;
  }

  function drawPolygon(polygon, color) {
    if(polygon.length === 0) {
      return;
    }

    context.beginPath();
    context.strokeStyle = '#F00';
    context.fillStyle = color || '#F00';
    context.moveTo(polygon[0].x, polygon[0].y);

    for(var i = 1; i < polygon.length; i++) {
      context.lineTo(polygon[i].x, polygon[i].y);
    }

    context.closePath();
    context.fill();
    context.stroke();
  }

  var cells = diagram.cells.slice(0);

  while(cells.length) {
    var cell = cells.pop();

    if(cell.used) {
      continue;
    }

    var polygon = getPolygon(cell);

    var neighborIds = cell.getNeighborIds();

    while(neighborIds.length) {
      var neighbor = diagram.cells[neighborIds.pop()];

      if(cell.height !== neighbor.height || neighbor.used) {
        continue;
      }

      var neighborPolygon = getPolygon(neighbor);
      
      polygon = clipper.union([polygon], [neighborPolygon])[0];

      neighbor.used = true;
      // neighborIds = neighborIds.concat(neighbor.getNeighborIds());
    }

    var color = Math.round(cell.height / levels * 255);
    drawPolygon(polygon, 'rgb(' + color + ',' + color + ',' + color + ')');
  }
}, 200);

// var line = [];

// var x = 0;
// var y = 0;

// for(var i = 0; i < 100; i++) {
//   x += Math.random() * 10;
//   y += Math.random() * 10;

//   if(Math.random() < 0.01) {
//     x -= 50;
//   }

//   line.push({ x: x, y: y });
// }

// function drawLine(line) {
//   context.clearRect(0, 0, width, height);
//   context.beginPath();
//   context.moveTo(line[0].x, line[0].y);
  
//   for(var i = 1; i < line.length; i++) {
//     var point = line[i];
//     context.lineTo(point.x, point.y);
//   }

//   context.stroke();
// }

// drawLine(line);

// var epislon = 100;

// setInterval(function() {
//   epislon *= 0.9;
//   console.log(epislon);
//   drawLine(simplify(line, epislon));
// }, 100);

// var image = context.createImageData(width, height);
// var data = image.data;

// var counter = 0;
// var levels = 1;

// var map = [];

// for(var x = 0; x < width; x++) {
//   var row = [];

//   for(var y = 0; y < height; y++) {
//     var n = simplexNoise.noise3D(x / (width / 2), y / (height / 2), counter / 64);

//     // normalize
//     n = (n + 1) / 2;
//     n = Math.round(n * levels);

//     row.push(n);

//     var color = Math.round(n * 256) / levels;

//     var index = (x + y * canvas.width) * 4;
//     data[index + 0] = color; // r
//     data[index + 1] = color; // g
//     data[index + 2] = color; // b
//     data[index + 3] = 255;   // a
//   }

//   map.push(row);
// }

// vectorize(map);

// context.putImageData(image, 0, 0);
