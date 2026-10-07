// A generative soundtrack, synthesised live with the Web Audio API: no audio files.
// Dark synthwave in A minor at 92 BPM: pumping pad, syncopated sub bass, a delayed
// arpeggio whose filter opens as you scroll, a soft kick and hats.
// It only ever starts from a user gesture, so browsers allow it and nobody gets ambushed.

const BPM = 92;
const STEP = 60 / BPM / 4; // one 16th note, in seconds
const LOOKAHEAD = 0.12; // schedule this far ahead
const TICK_MS = 25;

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Am7 → Fmaj7 → Dm7 → Em7, two bars each. [bass root, ...chord tones]
const PROGRESSION = [
  [33, 57, 60, 64, 67],
  [29, 53, 57, 60, 64],
  [38, 50, 53, 57, 60],
  [28, 52, 55, 59, 62],
];
const PENTATONIC = [69, 72, 74, 76, 79, 81, 84]; // A minor pentatonic, upper register
const ARP_PATTERN = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 6, 7, 6, 4, 2];
const BASS_STEPS = new Set([0, 3, 6, 8, 11, 14]);

type Listener = (playing: boolean) => void;

class Soundtrack {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private pump!: GainNode;
  private arpFilter!: BiquadFilterNode;
  private reverb!: ConvolverNode;
  private delay!: DelayNode;
  private noise!: AudioBuffer;
  private timer = 0;
  private step = 0;
  private nextTime = 0;
  private lastBlip = 0;
  private listeners = new Set<Listener>();
  playing = false;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.playing));
  }

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    comp.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);

    // Reverb: a generated stereo impulse, ~3s of decaying noise.
    this.reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 3;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    this.reverb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    this.reverb.connect(wet).connect(this.master);

    // Dotted-eighth ping-pong-ish delay for the arp and blips.
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = STEP * 3;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const delayTone = ctx.createBiquadFilter();
    delayTone.type = "lowpass";
    delayTone.frequency.value = 2400;
    this.delay.connect(delayTone).connect(fb).connect(this.delay);
    delayTone.connect(this.master);
    delayTone.connect(this.reverb);

    // Everything melodic sits on a "pump" bus that ducks on each beat (sidechain feel).
    this.pump = ctx.createGain();
    this.pump.connect(this.master);
    this.pump.connect(this.reverb);

    // The arp's filter is what scroll speed opens up.
    this.arpFilter = ctx.createBiquadFilter();
    this.arpFilter.type = "lowpass";
    this.arpFilter.frequency.value = 900;
    this.arpFilter.Q.value = 6;
    this.arpFilter.connect(this.pump);
    this.arpFilter.connect(this.delay);

    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const n = this.noise.getChannelData(0);
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx || !this.playing) return;
      if (document.hidden) this.ctx.suspend();
      else this.ctx.resume();
    });
  }

  async start() {
    if (this.playing) return;
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    await ctx.resume();
    this.playing = true;
    this.emit();
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.65, now + 2.5);
    this.step = 0;
    this.nextTime = now + 0.05;
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    this.emit();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.2);
    window.setTimeout(() => {
      if (this.playing) return;
      window.clearInterval(this.timer);
      this.ctx?.suspend();
    }, 1300);
  }

  toggle() {
    return this.playing ? this.stop() : this.start();
  }

  /** 0 (still) to 1 (fast scroll): opens the arp filter. */
  setMotion(v: number) {
    if (!this.ctx || !this.playing) return;
    this.arpFilter.frequency.setTargetAtTime(700 + v * 4200, this.ctx.currentTime, 0.25);
  }

  /** A quiet note in key, for hovering the work. Rate-limited. */
  blip() {
    if (!this.ctx || !this.playing) return;
    const t = this.ctx.currentTime;
    if (t - this.lastBlip < 0.12) return;
    this.lastBlip = t;
    const f = midi(PENTATONIC[(Math.random() * PENTATONIC.length) | 0]);
    const o = this.ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g);
    g.connect(this.master);
    g.connect(this.delay);
    o.start(t);
    o.stop(t + 0.4);
  }

  /** A filtered noise sweep, for opening a case study. */
  whoosh() {
    if (!this.ctx || !this.playing) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(250, t);
    bp.frequency.exponentialRampToValueAtTime(5000, t + 0.55);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    src.connect(bp).connect(g);
    g.connect(this.master);
    g.connect(this.reverb);
    src.start(t);
    src.stop(t + 0.75);
  }

  private schedule() {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
  }

  private playStep(step: number, t: number) {
    const s = step % 16;
    const bar = Math.floor(step / 16);
    const [root, ...chord] = PROGRESSION[Math.floor(bar / 2) % PROGRESSION.length];

    // Pump: duck the melodic bus on every beat.
    if (s % 4 === 0) {
      this.pump.gain.setValueAtTime(0.35, t);
      this.pump.gain.linearRampToValueAtTime(1, t + STEP * 3);
    }
    if (s === 0 || s === 8) this.kick(t);
    if (s % 4 === 2) this.hat(t, 0.05, 0.05);
    else if (Math.random() < 0.18) this.hat(t, 0.015, 0.03);
    if (s === 14 && bar % 4 === 3) this.hat(t, 0.04, 0.25); // open hat into the turnaround
    if (BASS_STEPS.has(s)) this.bass(midi(root + 12), t, s === 0 ? 0.32 : 0.22);
    if (s === 0 && bar % 2 === 0) this.pad(chord.map(midi), t, STEP * 32);

    // Arp: chord tones over two octaves; an octave higher in the second half of every 8 bars.
    const tones = [...chord, ...chord.map((m) => m + 12)];
    const lift = bar % 8 >= 4 ? 12 : 0;
    this.pluck(midi(tones[ARP_PATTERN[s] % tones.length] + lift), t);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.4);
  }

  private hat(t: number, level: number, decay: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    src.connect(hp).connect(g).connect(this.master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + decay + 0.02);
  }

  private bass(f: number, t: number, level: number) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(600, t);
    lp.frequency.exponentialRampToValueAtTime(140, t + 0.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + STEP * 2.4);
    for (const [type, detune] of [["sawtooth", 0], ["triangle", -1200]] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = detune;
      o.connect(lp);
      o.start(t);
      o.stop(t + STEP * 2.6);
    }
    lp.connect(g).connect(this.master);
  }

  private pad(freqs: number[], t: number, dur: number) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 2;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 450;
    lfo.connect(lfoAmt).connect(lp.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 1.6);
    g.gain.setValueAtTime(0.06, t + dur - 0.2);
    g.gain.linearRampToValueAtTime(0, t + dur + 2);
    for (const f of freqs) {
      for (const d of [-9, 9]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.detune.value = d;
        o.connect(lp);
        o.start(t);
        o.stop(t + dur + 2.1);
      }
    }
    lp.connect(g).connect(this.pump);
    lfo.start(t);
    lfo.stop(t + dur + 2.1);
  }

  private pluck(f: number, t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.045, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + STEP * 1.6);
    o.connect(g).connect(this.arpFilter);
    o.start(t);
    o.stop(t + STEP * 1.8);
  }
}

let instance: Soundtrack | null = null;

/** The single soundtrack for the page (created lazily, client-side only). */
export function soundtrack() {
  if (!instance) instance = new Soundtrack();
  return instance;
}
