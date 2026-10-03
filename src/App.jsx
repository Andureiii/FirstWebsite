import { useState, useEffect } from "react";

// Adds a leading zero: 5 -> "05"
const pad = (n) => String(n).padStart(2, "0");

// Turns milliseconds into "mm:ss.cc"
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

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
  const [laps, setLaps] = useState([]); // each lap: { id, split, total }

  // This effect re-runs whenever `running` changes.
  useEffect(() => {
    if (!running) return;

    const startedAt = Date.now() - elapsed;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 10);

    // Cleanup: stops the timer when we press Stop or leave the page.
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function addLap() {
    const lastTotal = laps.length ? laps[laps.length - 1].total : 0;
    setLaps([...laps, { id: laps.length + 1, split: elapsed - lastTotal, total: elapsed }]);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  // With 2 or more laps, mark the fastest lap green and the slowest red.
  const splits = laps.map((lap) => lap.split);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);

  function lapColor(lap) {
    if (laps.length < 2) return "";
    if (lap.split === fastest) return "text-go";
    if (lap.split === slowest) return "text-stop";
    return "";
  }

  return (
    <section className={panel}>
      <h2 className={heading}>Stopwatch</h2>
      <div className={display}>{formatTime(elapsed)}</div>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <button className={`${btn} bg-go`} onClick={() => setRunning(true)} disabled={running}>
          Start
        </button>
        <button className={`${btn} bg-stop`} onClick={() => setRunning(false)} disabled={!running}>
          Stop
        </button>
        <button className={`${btn} bg-lap`} onClick={addLap} disabled={!running}>
          Lap
        </button>
        <button className={`${btn} bg-accent`} onClick={reset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <ol className="mt-5 max-h-48 divide-y divide-edge overflow-y-auto text-left font-mono text-sm">
          {[...laps].reverse().map((lap) => (
            <li key={lap.id} className={`flex justify-between py-2 ${lapColor(lap)}`}>
              <span>Lap {lap.id}</span>
              <span>{formatTime(lap.split)}</span>
              <span className="text-muted">{formatTime(lap.total)}</span>
            </li>
          ))}
        </ol>
      )}
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