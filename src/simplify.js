'use strict';

function simplify(line, epsilon) {
  var result;

  // Find the point with the maximum distance
  var index = 0;
  var maxDistance = 0;
  var start = line[0];
  var end = line[line.length - 1];

  for(var i = 1; i < line.length - 2; i++) {
    var point = line[i];

    var distance = distToSegment(point, start, end);

    if(distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if(maxDistance > epsilon) {
    var lineSegment1 = simplify(line.slice(0, index), epsilon);
    var lineSegment2 = simplify(line.slice(index), epsilon);

    result = lineSegment1.slice(0, -1).concat(lineSegment2.slice(1));
  }
  else {
    result = line;
  }

  return result;
}

function sqr(x) { 
  return x * x; 
}

function dist2(v, w) { 
  return sqr(v.x - w.x) + sqr(v.y - w.y); 
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  
  if(l2 === 0) {
    return dist2(p, v);
  }

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if(t < 0) {
    return dist2(p, v);
  }
  if(t > 1) {
    return dist2(p, w);
  }

  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) { 
  return Math.sqrt(distToSegmentSquared(p, v, w)); 
}

module.exports = simplify;