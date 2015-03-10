'use strict';

var _ = require('underscore');

var Clipper = {};

Clipper.intersect = function(subject, clip) {
  return this._clipper(subject, clip, ClipperLib.ClipType.ctIntersection);
};

Clipper.union = function(subject, clip) {
  return this._clipper(subject, clip, ClipperLib.ClipType.ctUnion);
};

Clipper.difference = function(subject, clip) {
  return this._clipper(subject, clip, ClipperLib.ClipType.ctDifference);
};  

Clipper.offset = function(paths, amount, MiterLimit, ArcTolerance) {
  var clipperOffset = new ClipperLib.ClipperOffset();
  var solution = [];

  paths = Clipper._pathsToUpperCase(paths);

  clipperOffset.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  clipperOffset.MiterLimit = MiterLimit || 2;
  clipperOffset.ArcTolerance = ArcTolerance || 0.25;

  clipperOffset.Execute(solution, amount);

  return Clipper._pathsToLowerCase(solution);
};

Clipper._clipper = function(subject, clip, clipType) {
  var clipper = new ClipperLib.Clipper();
  var scale = 100;
  var solution = [];

  subject = Clipper._pathsToUpperCase(subject);
  clip = Clipper._pathsToUpperCase(clip);

  // ClipperLib.JS.ScaleUpPaths(subject, scale);
  // ClipperLib.JS.ScaleUpPaths(clip, scale);

  clipper.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  clipper.AddPaths(clip, ClipperLib.PolyType.ptClip, true);

  clipper.Execute(
    clipType, 
    solution, 
    ClipperLib.PolyFillType.pftNonZero, 
    ClipperLib.PolyFillType.pftNonZero
  );

  // ClipperLib.JS.ScaleUpPaths(solution, 1 / scale);

  return Clipper._pathsToLowerCase(solution);
};

Clipper._pathsToLowerCase = function(paths) {
  return _.map(paths, function(path) {
    return _.map(path, function(point) {
      if(!_.isUndefined(point.X)) {
        return { x: point.X, y: point.Y };
      }
      return point;
    });
  });
};

Clipper._pathsToUpperCase = function(paths) {
  return _.map(paths, function(path) {
    return _.map(path, function(point) {
      if(!_.isUndefined(point.x)) {
        return { X: point.x, Y: point.y };
      }
      return point;
    });
  });
};

module.exports = Clipper;