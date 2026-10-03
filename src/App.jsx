import { useState, useEffect } from "react";

// Adds a leading zero: 5 -> "05"
const pad = (n) => String(n).padStart(2, "0");

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
    <section className="panel">
      <h2>Digital Clock</h2>
      <div className="display">
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </div>
      <p className="date">{now.toDateString()}</p>
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
    <section className="panel">
      <h2>Stopwatch</h2>
      <div className="display">
        {pad(minutes)}:{pad(seconds)}.{pad(centis)}
      </div>
      <div className="buttons">
        <button className="start" onClick={() => setRunning(true)} disabled={running}>
          Start
        </button>
        <button className="stop" onClick={() => setRunning(false)} disabled={!running}>
          Stop
        </button>
        <button className="reset" onClick={reset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="page">
      <h1>Clock + Stopwatch</h1>
      <div className="grid">
        <Clock />
        <Stopwatch />
      </div>
    </div>
  );
}
