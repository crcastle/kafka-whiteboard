var socket = io();
var painting = document.getElementById("painting");
var ctx = painting.getContext("2d");
painting.width = window.innerWidth;
painting.height = window.innerHeight;
var strokes = [];
var randomcolor = require("randomcolor");
var color = randomcolor({ luminosity: "bright" });

var brush = { down: false, x: 0, y: 0, color: color };

var isTouchSupported = "ontouchstart" in window;
var isPointerSupported = navigator.pointerEnabled;
var isMSPointerSupported = navigator.msPointerEnabled;

var downEvent = isTouchSupported
  ? "touchstart"
  : isPointerSupported
    ? "pointerdown"
    : isMSPointerSupported ? "MSPointerDown" : "mousedown";
var moveEvent = isTouchSupported
  ? "touchmove"
  : isPointerSupported
    ? "pointermove"
    : isMSPointerSupported ? "MSPointerMove" : "mousemove";
var upEvent = isTouchSupported
  ? "touchend"
  : isPointerSupported
    ? "pointerup"
    : isMSPointerSupported ? "MSPointerUp" : "mouseup";

painting.addEventListener(downEvent, e => {
  Object.assign(brush, { down: true, x: e.clientX, y: e.clientY });
});
painting.addEventListener(upEvent, e => {
  Object.assign(brush, { down: false });
});
painting.addEventListener("mouseleave", e => {
  Object.assign(brush, { down: false });
});
painting.addEventListener(moveEvent, e => {
  if (!brush.down) return;
  strokes.push({
    color: brush.color,
    x0: brush.x,
    y0: brush.y,
    x1: e.clientX,
    y1: e.clientY
  });
  Object.assign(brush, { x: e.clientX, y: e.clientY });
  paint(strokes);
});
socket.addEventListener("paint", paint);

setInterval(transmit, 50);

function paint(segments) {
  ctx.beginPath();
  Object.assign(ctx, {
    lineWidth: 10,
    lineCap: "round",
    lineJoin: "round"
  });
  segments.forEach((segment, i) => {
    ctx.moveTo(segment.x0, segment.y0);
    ctx.lineTo(segment.x1, segment.y1);
    ctx.strokeStyle = segment.color;
  });
  ctx.stroke();
}

function transmit() {
  if (!strokes.length) return;
  console.log(strokes.slice(0));
  socket.emit("strokes", strokes.splice(0));
}
