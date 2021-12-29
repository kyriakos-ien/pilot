// This work is licensed under the Creative Commons Attribution 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/ 
// or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

const frameSize = 1200;
const canvasSize = 1600;
let circleNum;
let shapeSize;
let thinkness;
let palette;
let bugged;
let palettes = {
  "Black & White": ["#dfdfdf","#c6c6c6","#ffffff","#bfbfbf","#9f9f9f","#606060","#404040","#202020","#000000"],
  "Balloon": ["#f3e3bb","#facb6b","#7c2d3c","#09906B","#12363E","#84afb5","#ea442c","#659cae","#7c847c"],
  "Ice Cream": ["#8b86a7","#f3ac9c","#1d2160","#e91d2b","#f29086","#f2746c","#ECE2D9","#6c6c97","#b9b4c0"],
  "Retro": ["#bdd9d0","#f2e0d7","#364756","#e63d58","#f8b90c","#10b39e","#8fa8ab","#f4cf78","#d99490"]
};
//Utility. Random number in range
function randInt(min, max) {
  return floor(fxrand() * (max - min) ) + min;
}

function fxBool(value) {
  return fxrand() < value;
}


function randList(list) {
  return list[randInt(0, list.length)]
}

function getBug(value){
  if (value < 0.8) return false
  else return true
}

function getPalette(value) {
  if (value <0.1) return "Black & White"
  if (value <0.4) return "Balloon"
  if (value <0.7) return "Ice Cream"
  if (value <1) return "Retro"
}

function getThinkness(value) {
  if (value == 2) return "Thin"
  if (value == 3) return "Medium"
  else return "Bold"
}
function getGrid(value) {
  return `${value}x${value}`
}
function preload() {
  let grids = [1,2,3,4,5,6,8,10,15,20]
  circleNum = randList(grids);
  bugged = getBug(fxrand());
  paletteName = getPalette(fxrand())
  palette = palettes[paletteName]
  shapeSize = frameSize/(1.2*circleNum);
  thinkness = randInt(2,5);

  window.$fxhashFeatures = {
    "Thinkness": getThinkness(thinkness),
    "Grid": getGrid(circleNum),
    "Bugged": bugged,
    "Pallete": paletteName
  }
  console.log(window.$fxhashFeatures);
}

function setup() {
  createCanvas(canvasSize, canvasSize);
  frame = createGraphics(frameSize, frameSize);
}

function draw() {
  //Backgrounds
  background(255);
  background(palette[1]);
  frame.fill(palette[0]);
  frame.stroke(50);
  frame.strokeWeight(10);
  frame.rect(0,0,frameSize, frameSize);
  smooth();

  //Generating the grid
  let spacing = circleNum * 2;
  grid(frame.width/spacing,frame.height/spacing);
  let space = (canvasSize - frameSize)/2;
  frame.fill(0,0,0,0);
  frame.rect(0,0,frameSize, frameSize);
  image(frame,space,space);

  //Texture
  var d = pixelDensity();
  loadPixels();
  var n = 4 * (width * d) * (height * d);
  for (let i = 0; i < n; i++) {
    pixels[i] = pixels[i] + (fxrand()*50)-10;
  }
  updatePixels();
  noLoop();
  

}

//Plots the grid
function grid(x, y) {
  for (let i = 0; i < frame.width; i+= (frame.width/circleNum)){
    for (let j = 0; j < frame.width; j+= (frame.height/circleNum)){
      if (bugged){
        let a = fxrand();
        if(a<0.5){
          drawShapes(x+i, y+j, true);
        }else{
          drawShapes(x+i, y+j, false);
        }
      }else{
        drawShapes(x+i, y+j, bugged);
      }
    }
  }
}

function drawShapes(x, y, bugged){
  let spacing = [];
  let shapes = ceil(randInt(2,7));
  //Spacing 
  for (let i = 0; i<shapes; i++){
    spacing[i] = ((shapeSize-(shapeSize/10))*fxrand());
  }
  spacing = sort(spacing);
  for (let i = 0; i<shapes; i++){
    frame.push();
    frame.translate(x, y);
    frame.strokeWeight(thinkness);
    frame.stroke(50);
    frame.fill(randList(palette));
    rectOrCircle = fxrand();
    if (rectOrCircle < 0.5){
      frame.rectMode(CENTER); 
      let angles = [0, 30, 60, 90]
      angleMode(DEGREES)
      frame.rotate(randList(angles))
      if(bugged){
        frame.rect(0, 0, 2*shapeSize - spacing[i]);
      }else{
        frame.rect(0, 0, shapeSize - spacing[i]);
      }
      frame.rectMode();
    }
    else {
      if (bugged){
        frame.ellipse(0, 0, 2*shapeSize - spacing[i])
      }else{
        frame.ellipse(0, 0, shapeSize - spacing[i])
      }
    }

    frame.pop();
  }
}
