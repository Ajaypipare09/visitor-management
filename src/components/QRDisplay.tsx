// Deterministic decorative QR-like pattern (UI only)
export function QRDisplay({ value, size = 200 }: { value: string; size?: number }) {
  const grid = 25;
  const cell = size / grid;
  // simple hash
  const hash = (i: number, j: number) => {
    let h = 2166136261;
    const s = `${value}-${i}-${j}`;
    for (let k = 0; k < s.length; k++) {
      h ^= s.charCodeAt(k);
      h = (h * 16777619) >>> 0;
    }
    return h % 100;
  };
  const cells = [];
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      if (hash(i, j) < 50) {
        cells.push(<rect key={`${i}-${j}`} x={i * cell} y={j * cell} width={cell} height={cell} fill="currentColor" />);
      }
    }
  }
  const corner = (x: number, y: number) => (
    <g key={`c-${x}-${y}`}>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="currentColor" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill="currentColor" />
    </g>
  );
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-primary">
        <rect width={size} height={size} fill="white" />
        {cells}
        {corner(0, 0)}
        {corner(size - cell * 7, 0)}
        {corner(0, size - cell * 7)}
      </svg>
    </div>
  );
}
