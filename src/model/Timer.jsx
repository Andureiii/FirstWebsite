import { useState, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");
const panel =
  "w-full max-w-[380px] rounded-2xl border-2 border-slate-200 bg-white px-5 py-7 dark:border-edge dark:bg-panel";
const heading = "mb-4 text-[1.1rem] font-bold text-slate-500 dark:text-muted";
const display = "font-mono text-[2.6rem] font-bold tracking-[2px] tabular-nums";
const field =
  "rounded-[10px] border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-edge dark:bg-ink dark:text-fg";
const btn =
  "cursor-pointer rounded-[10px] px-[18px] py-2.5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40";

class TimerModel {
  constructor({ minutes = 1, seconds = 0, remaining = null, running = false } = {}) {
    this.minutes = minutes;
    this.seconds = seconds;
    this.remaining = remaining;
    this.running = running;
  }

  with(changes) {
    return new TimerModel({ ...this, ...changes });
  }

  get notStarted() {
    return this.remaining === null;
  }

  get finished() {
    return this.remaining === 0;
  }

  get setupMs() {
    return (this.minutes * 60 + this.seconds) * 1000;
  }

  static clamp(value, max) {
    return Math.max(0, Math.min(max, Number(value) || 0));
  }

  static format(ms) {
    const total = Math.ceil(ms / 1000);
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
  }

  setMinutes(value) {
    return this.with({ minutes: TimerModel.clamp(value, 99) });
  }

  setSeconds(value) {
    return this.with({ seconds: TimerModel.clamp(value, 59) });
  }

  start() {
    if (this.notStarted) {
      if (this.setupMs <= 0) return this;
      return this.with({ remaining: this.setupMs, running: true });
    }
    return this.with({ running: true });
  }

  pause() {
    return this.with({ running: false });
  }

  reset() {
    return this.with({ remaining: null, running: false });
  }

  tick(left) {
    if (left <= 0) return this.with({ remaining: 0, running: false });
    return this.with({ remaining: left });
  }
}

export default function Timer() {
  const [timer, setTimer] = useState(new TimerModel());

  useEffect(() => {
    if (!timer.running) return;

    const endAt = Date.now() + timer.remaining;
    const id = setInterval(() => {
      setTimer((t) => t.tick(endAt - Date.now()));
    }, 100);

    return () => clearInterval(id);
  }, [timer.running]);

  return (
    <section className={panel}>
      <h2 className={heading}>Timer</h2>

      {timer.notStarted ? (
        <div className="flex items-center justify-center gap-2 font-mono text-[2.6rem] font-bold">
          <input
            type="number"
            min="0"
            max="99"
            aria-label="Minutes"
            value={timer.minutes}
            onChange={(e) => setTimer(timer.setMinutes(e.target.value))}
            className={`${field} w-24 text-center text-3xl`}
          />
          <span>:</span>
          <input
            type="number"
            min="0"
            max="59"
            aria-label="Seconds"
            value={timer.seconds}
            onChange={(e) => setTimer(timer.setSeconds(e.target.value))}
            className={`${field} w-24 text-center text-3xl`}
          />
        </div>
      ) : (
        <div className={`${display} ${timer.finished ? "text-red-600 dark:text-stop" : ""}`}>
          {TimerModel.format(timer.remaining)}
        </div>
      )}

      {timer.finished && <p className="mt-2 font-semibold text-red-600 dark:text-stop">Time's up!</p>}

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <button
          className={`${btn} bg-go`}
          onClick={() => setTimer(timer.start())}
          disabled={timer.running || timer.finished}
        >
          {timer.notStarted ? "Start" : "Resume"}
        </button>
        <button className={`${btn} bg-lap`} onClick={() => setTimer(timer.pause())} disabled={!timer.running}>
          Pause
        </button>
        <button className={`${btn} bg-accent`} onClick={() => setTimer(timer.reset())} disabled={timer.notStarted}>
          Reset
        </button>
      </div>
    </section>
  );
}