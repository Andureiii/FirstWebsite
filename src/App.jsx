import { useState, useEffect } from "react";

// Adds a leading zero: 5 -> "05"
const pad = (n) => String(n).padStart(2, "0");

// Tailwind classes that are reused in more than one place
const panel = "w-full max-w-[380px] rounded-2xl border-2 border-edge bg-panel px-5 py-7";
const heading = "mb-4 text-[1.1rem] font-bold text-muted";
const display = "font-mono text-[2.6rem] font-bold tracking-[2px] tabular-nums";
const btn =
  "cursor-pointer rounded-[10px] px-[18px] py-2.5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40";

function Clock() {
  const [now, setNow] = useState(new Date());

  // useEffect runs after the component appears on screen.
  // We start a timer that updates the time every second.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    // Cleanup: stop the timer when the component is removed.
    return () => clearInterval(id);
  }, []);

  return (
    <section className={panel}>
      <h2 className={heading}>Digital Clock</h2>
      <div className={display}>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </div>
      <p className="mt-3 text-muted">{now.toDateString()}</p>
    </section>
  );
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [running, setRunning] = useState(false);

  // This effect re-runs whenever `running` changes.
  useEffect(() => {
    if (!running) return;

    const startedAt = Date.now() - elapsed;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 10);

    // Cleanup: stops the timer when we press Stop or leave the page.
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const centis = Math.floor((elapsed % 1000) / 10);

  function reset() {
    setRunning(false);
    setElapsed(0);
  }

  return (
    <section className={panel}>
      <h2 className={heading}>Stopwatch</h2>
      <div className={display}>
        {pad(minutes)}:{pad(seconds)}.{pad(centis)}
      </div>
      <div className="mt-5 flex justify-center gap-2.5">
        <button className={`${btn} bg-go`} onClick={() => setRunning(true)} disabled={running}>
          Start
        </button>
        <button className={`${btn} bg-stop`} onClick={() => setRunning(false)} disabled={!running}>
          Stop
        </button>
        <button className={`${btn} bg-accent`} onClick={reset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink px-5 py-8 text-center text-fg">
      <h1 className="mb-7 text-[2rem] font-bold text-accent">Clock + Stopwatch</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Clock />
        <Stopwatch />
      </div>
    </div>
  );
}