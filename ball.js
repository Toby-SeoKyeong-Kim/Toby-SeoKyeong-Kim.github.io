class Ball {
  constructor(p, v, m, c) {
    this.pos = p;
    this.vel = v;
    this.acc = createVector(0,0,0);
    this.maxSpeed = 1;
    this.maxForce = 0.2;
    this.mass = m;
    this.st = 0;
    this.lat = random(6.28);
    this.lon = random(6.28);
    this.color = c;
    this.inPosition = false;
    this.e =false;
  }

  attract(ball){
    let force = p5.Vector.sub(this.pos, ball.pos);
    let distanceSq = constrain(force.magSq(), 100, 2000);
    let G = 1.5;
    let strength = (G * (this.mass * ball.mass)) / distanceSq;
    force.setMag(strength);
    ball.applyForce(force);
  }
  update(){
    if(stage == 0){
      this.wander();
    }
    this.vel.add(this.acc);
    if(stage == 0){
      this.vel.limit(this.maxSpeed);
    }
    this.pos.add(this.vel);
    this.acc.set(0,0,0);
    if(stage == 0){
      //this.pos.z = constrain(this.pos.z, -200, 100);
    }
  }
  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(200);
    wanderPoint.add(this.pos);

    let wanderRadius = 50;

    const x = wanderRadius * sin(this.lat) * cos(this.lon);
    const y = wanderRadius * sin(this.lat) * sin(this.lon);
    const z = wanderRadius * cos(this.lat);

    wanderPoint.add(x, y, z);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    let displaceRange = 0.2;
    this.lat += random(-displaceRange, displaceRange);
    this.lon += random(-displaceRange, displaceRange);
  }
  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = 7;

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(.3);
    this.applyForce(force);
  }
  seek2(target) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = 7;

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(1);
    if(dist(target.x,target.y,target.z, this.pos.x,this.pos.y,this.pos.z) < 4){
      force.mult(0);
      this.vel.mult(.8);
      this.inPosition = true;
    }
    this.applyForce(force);
  }

  arrive(target) {
    return this.seek(target, true);
  }
  applyForce(force){
    if(stage == 1){
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
    }else{
      this.acc.add(force);
    }
  }

  show(){
    push();
    if (this.e) {
      shininess(1);
    }
    specularMaterial(this.color);
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(50);
    pop();
  }
}
