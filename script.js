const canvas = document.querySelector('#drawingCanvas');
const ctx = canvas.getContext('2d');


const canvasp51 = document.querySelector('#canvasp5-1');
const canvasp52 = document.querySelector('#canvasp5-2');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let counter = 0;


const handleMouseMove = (event) => {
  // console.log(counter);
  const x = event.clientX;
  const y = event.clientY;
  ctx.beginPath();
  ctx.arc(x, y, counter, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = "#59bfff";
  counter += 0.3;

  // console.log(event);
};

const handleMouseClic = (event) => {
  counter = 0;
};

let ongoingTouches = [];

const handleStart = (event) => {
  event.preventDefault();
  var touches = event.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ctx.strokeStyle = "#59bfff";
    ctx.fillRect(touches[i].pageX - 2, touches[i].pageY - 2, 4, 4);
  }

  canvasp51.style.overflow = 'hidden';
  canvasp52.style.overflow = 'hidden';

}

function handleMove(event) {
  event.preventDefault();
  var touches = event.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ctx.strokeStyle = "#59bfff";
    ctx.fillRect(touches[i].pageX - 2, touches[i].pageY - 2, 4, 4);
  }
}

function handleEnd(event) {
  event.preventDefault();
  var touches = event.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ctx.strokeStyle = "#59bfff";
    ctx.fillRect(touches[i].pageX - 2, touches[i].pageY - 2, 4, 4);
  }

  canvasp51.style.overflow = 'visible';
  canvasp52.style.overflow = 'visible';
}


canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('click', handleMouseClic);

canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);


canvasp51.addEventListener("touchstart", handleStart, false);
canvasp51.addEventListener("touchend", handleEnd, false);


canvasp52.addEventListener("touchstart", handleStart, false);
canvasp52.addEventListener("touchend", handleEnd, false);



