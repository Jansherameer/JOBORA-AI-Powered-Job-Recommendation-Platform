export default function MatchCircle({ score, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 70) return { stroke: 'hsl(142.1 76.2% 36.3%)', text: 'text-green-600' };
    if (s >= 50) return { stroke: 'hsl(221.2 83.2% 53.3%)', text: 'text-primary' };
    if (s >= 30) return { stroke: 'hsl(38 92% 50%)', text: 'text-amber-600' };
    return { stroke: 'hsl(215.4 16.3% 46.9%)', text: 'text-muted-foreground' };
  };

  const { stroke, text } = getColor(score);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--color-muted) / 0.5)"
          strokeWidth="3.5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs ${text}`}>
        {Math.round(score)}%
      </div>
    </div>
  );
}
