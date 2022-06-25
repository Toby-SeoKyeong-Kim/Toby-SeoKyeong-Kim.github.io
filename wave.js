
class Wavee {
  constructor(amp, period, phase) {
    this.amplitude = amp;
    this.period = period;
    this.phase = phase;
  }

  evaluate(x) {
    return sin(this.phase + (TWO_PI * x) / this.period) * this.amplitude;
  }

  update() {
    this.phase += .05;
    if(this.phase > TWO_PI){
      this.phase -= TWO_PI;
    }
  }
}
