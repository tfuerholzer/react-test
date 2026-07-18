import { useMemo } from 'react';
import { Subject, interval, map, scan, startWith } from 'rxjs';
import { useObservable } from './hooks/useObservable';

export function App() {
  // A live clock driven by an RxJS interval stream.
  const clock$ = useMemo(
    () =>
      interval(1000).pipe(
        startWith(0),
        map(() => new Date().toLocaleTimeString())
      ),
    []
  );
  const time = useObservable(clock$, new Date().toLocaleTimeString());

  return (
    <main className="app">
      <h1>React + esbuild + TypeScript + SCSS + RxJS</h1>
      <p className="clock">🕐 {time}</p>
      <Counter />
      <p className="hint">
        Edit <code>src/App.tsx</code> and save — the page reloads automatically.
      </p>
    </main>
  );
}

function Counter() {
  // Fold a stream of +1/-1 click events into a running total with `scan`.
  const clicks$ = useMemo(() => new Subject<number>(), []);
  const total$ = useMemo(
    () => clicks$.pipe(scan((acc, delta) => acc + delta, 0), startWith(0)),
    [clicks$]
  );
  const count = useObservable(total$, 0);

  return (
    <div className="counter">
      <button onClick={() => clicks$.next(-1)} aria-label="decrement">
        −
      </button>
      <span>{count}</span>
      <button onClick={() => clicks$.next(1)} aria-label="increment">
        +
      </button>
    </div>
  );
}
