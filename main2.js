
var p5Canvas = document.getElementById('p5Canvas');
let balls = [];
let pink;
let hotpink;
let orange;
let blue ;
let stage = 1;
let sun;
let ws = [];
let cs =[];
let particles=[];
let vs = [];
let toggle = true;
let moving = false;
let sequencing = false;
let sequenceDur = 0;
let movingSequenceDur = 0;
let mv;
var hheight;

function setup() {

  var canv = createCanvas(max(windowWidth, p5Canvas.clientWidth), max(windowHeight, p5Canvas.clientHeight), WEBGL);
  width =max(windowWidth, p5Canvas.clientWidth);
  height = max(windowHeight, p5Canvas.clientHeight);
  hheight = width * .5625;
  canv.parent('#p5Canvas');


   pink = color(245, 176, 194);
   hotpink= color(252, 21, 117);
   orange = color(235, 52, 2);
   blue = color(0, 36, 146);
   cs.push(blue);
   cs.push(pink);
   cs.push(hotpink);
   cs.push(orange);

   for(var i = 0; i < 16; i++){
     let pos = createVector(random(-width/2, width/2),random(-hheight/2, hheight/2),random(-100));
     let vel = createVector(random(-2, 2), random(-2, 2), -1);
     var col = cs[Math.floor(random(4))];
     if(i == 0 || i == 3){
       col = cs[1];
     }
     balls.push(new Ball(pos,vel,random(10,15),col));
   }
   for(var i = 0; i < 1; i++){
     ws.push(new Wavee(hheight/2, 12, random(TWO_PI)));
   }
   sun = new Ball(createVector(0,0,-150),createVector(0,0,0), 700);
   sun2 = new Ball(createVector(width/2,-hheight/4,-50),createVector(0,0,0), 600);

   vs.push(createVector(-width*7/16, 0, -50));
   vs.push(createVector(-width*4/16, -hheight*1/16, -50));
   vs.push(createVector(-width*7/16, hheight*4/16, -50));
   vs.push(createVector(-width*4/16, hheight*3/16, -50));
   let s = vs[1].copy();
   let df = vs[2].copy();
   df.sub(vs[0]);
   s.sub(vs[0]);
   s.normalize();
   s.mult(width*14/32);
   let ss = s.copy();
   ss.mult(2.2);
   var dff = df.div(2)
   s.add(dff);
   s.add(vs[0]);
   vs.push(s);
   ss.add(dff);
   ss.add(vs[0]);
   vs.push(ss);
   mv = vs[1].copy();
}

function draw(){
  background(5);
  ambientLight(130);
  directionalLight(blue, -width/2, -height/2, -100);
  directionalLight(pink, width/2, -height/2, -100);
  directionalLight(orange, -width/2, height/2, -100);
  directionalLight(hotpink, width/2, height/2, -100);

  //stroke(255);
  //strokeWeight(10);


  // line(vs[0].x,vs[0].y,vs[0].z, vs[1].x,vs[1].y,vs[1].z); // 0 -2
  // line(vs[2].x,vs[2].y,vs[2].z, vs[3].x,vs[3].y,vs[3].z); // 3 - 5
  // line(vs[1].x,vs[1].y,vs[1].z, vs[4].x,vs[4].y,vs[4].z); // 6 - 7
  // line(vs[3].x,vs[3].y,vs[3].z, vs[4].x,vs[4].y,vs[4].z); // 8 - 9
  // line(vs[5].x,vs[5].y,vs[5].z, vs[4].x,vs[4].y,vs[4].z); // 10 - 15
  //orbitControl(1,1,.1);
  shininess(20);
  noStroke();

  if(stage == 1){
    sun.attract(sun2);
    for(let ball of balls){
      sun.attract(ball);
      sun2.attract(ball);
      for (other of balls) {
        if(ball !== other){
          ball.attract(other);
        }
      }
    }
  }

  for(let i = balls.length-1; i >= 0; i--){
    balls[i].show();
    if(stage == 2){
      let y = 0;
      for(var w = 0; w < 1; w++){
        y += ws[w].evaluate(i*1);
      }
      balls[i].seek(createVector(-width/2 + width *(i+1)/16, y , -50));
    }
    if(stage == 3){
      if(i <= 2){
        let vl = p5.Vector.lerp(vs[0], vs[1], i / 3);
        balls[i].seek2(vl);
      }else if(i <= 5){
        let vl = p5.Vector.lerp(vs[2], vs[3], (i-3) / 3);
        balls[i].seek2(vl);
      }else if(i <= 8){
        if(!sequencing){
          let vl = p5.Vector.lerp(vs[1], vs[4], (i-6) / 3);
          balls[i].seek2(vl);
          if(alllInPos()) {
            sequencing = true;
            moving = false;
            lightSwitch(true);
          }
        }else{
          if(moving){
            if(i == 8){
              if(!toggle){
                mv = p5.Vector.lerp(vs[1], vs[3], (movingSequenceDur / 40));
              }else{
                mv = p5.Vector.lerp(vs[3], vs[1], (movingSequenceDur / 40));
              }
              if(movingSequenceDur > 40){
                moving = false;
                lightSwitch(true);
                movingSequenceDur = 0;
              }else{
                movingSequenceDur++;
              }
            }// if i = 8

          }else{

            if(i == 6){
              if(sequenceDur < 80){
                sequenceDur++;
              }else{
                sequenceDur = 0;
                moving = true;
                lightSwitch(false);
                if(toggle){
                  toggle = false;
                }else{
                  toggle = true;
                }
              }
            }
          }// !moving

          let vl = p5.Vector.lerp(mv, vs[4], (i-6) / 3);
          balls[i].seek2(vl);
        }//if sequencing

      }else{
        let vl = p5.Vector.lerp(vs[4], vs[5], (i-9) / 7);
        balls[i].seek2(vl);
      }
    }//stage 3
    balls[i].update();
  }

  if(stage ==2){
    for (let w of ws) {
      w.update();
    }
  }

}

function stageOne(){
  stage = 1;
}
function stageTwo(){
  stage = 2;
}
function stageThree(){
  stage = 3;
}
function stageO(){
  stage = 0;
  sun2.pos.set(width/2,-hheight/4,-50);

  toggle = true;
   moving = false;
   sequencing = false;
   sequenceDur = 0;
   movingSequenceDur = 0;
   lightSwitch(false);
   mv = vs[1].copy();
   for (ball of balls) {
     ball.inPosition = false;
   }
}

function windowResized() {
  resizeCanvas(max(windowWidth, p5Canvas.clientWidth), max(windowHeight, p5Canvas.clientHeight));
  width =max(windowWidth, p5Canvas.clientWidth);
  height = max(windowHeight, p5Canvas.clientHeight);
  hheight = width * .5625;
  vs[0] = createVector(-width*7/16, 0, -50);
  vs[1] = createVector(-width*4/16, -hheight*1/16, -50);
  vs[2] = createVector(-width*7/16, hheight*4/16, -50);
  vs[3] = createVector(-width*4/16, hheight*3/16, -50);
  let s = vs[1].copy();
  let df = vs[2].copy();
  df.sub(vs[0]);
  s.sub(vs[0]);
  s.normalize();
  s.mult(width*14/32);
  let ss = s.copy();
  ss.mult(2.2);
  var dff = df.div(2)
  s.add(dff);
  s.add(vs[0]);
  vs[4] = s;
  ss.add(dff);
  ss.add(vs[0]);
  vs[5] = ss;
  for(var i = 0; i < 1; i++){
    ws[i].amplitude = hheight/2;
  }
  if(!toggle){
    mv = p5.Vector.lerp(vs[1], vs[3], (movingSequenceDur / 40));
  }else{
    mv = p5.Vector.lerp(vs[3], vs[1], (movingSequenceDur / 40));
  }
}

function alllInPos(){
  for (ball of balls) {
    if(!ball.inPosition) return false;
  }
  return true;
}

function lightSwitch(on){
  var size = min(50, width*5/192);
  var lightsize = size * .7;
  if(on){
    if(toggle){
      balls[0].e = true;
    }else{
      balls[3].e = true;
    }
  }else{ //if off
    balls[3].e = false;
    balls[0].e = false;
  }
}
// function mouseReleased(){
//   balls.push(new Ball());
// }
