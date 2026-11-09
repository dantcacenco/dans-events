// Decorative only (aria-hidden): a string of lights and falling snow. Both stop for prefers-reduced-motion (see christmas.css).
const BULBS = ["red", "gold", "green", "snow"] as const;

export function Lights() {
  return (
    <div className="xm-lights" aria-hidden>
      <ul>
        {Array.from({ length: 17 }, (_, i) => (
          <li key={i} className={BULBS[i % BULBS.length]} style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
        ))}
      </ul>
    </div>
  );
}

// Fixed positions from the index, never Math.random, so server and browser render the same markup.
export function Snow() {
  return (
    <div className="xm-snow" aria-hidden>
      {Array.from({ length: 26 }, (_, i) => {
        const size = 3 + ((i * 7) % 6);
        return <i key={i} style={{ left: `${(i * 37) % 100}%`, width: size, height: size, opacity: 0.35 + ((i * 13) % 5) / 10, animationDuration: `${9 + ((i * 5) % 9)}s`, animationDelay: `-${(i * 3) % 14}s` }} />;
      })}
    </div>
  );
}
