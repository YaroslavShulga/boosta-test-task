// Segmented semicircle-style gauge (green → red) with a needle. Pure SVG, rendered on the server;
// the needle sweep is a CSS animation driven by the `--needle-angle` custom property.

const CENTER = 100;
const RADIUS = 78;
const SWEEP = 240; // degrees, from -120° (score 0) to +120° (score max)
const GAP = 5; // degrees between segments
const SEGMENT_COLORS = ["#86cfa0", "#b9d77a", "#e9cf5b", "#efa648", "#e6603f"];

function polar(angle: number, radius = RADIUS) {
  const radians = (angle * Math.PI) / 180;
  return { x: CENTER + radius * Math.sin(radians), y: CENTER - radius * Math.cos(radians) };
}

function arcPath(from: number, to: number) {
  const start = polar(from);
  const end = polar(to);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
}

export function ScoreGauge({ score, maxScore }: ScoreGaugeProps) {
  const ratio = Math.min(Math.max(score / maxScore, 0), 1);
  const needleAngle = -SWEEP / 2 + ratio * SWEEP;
  const segment = SWEEP / SEGMENT_COLORS.length;

  return (
    <figure className="w-44 sm:w-52">
      <svg viewBox="0 0 200 172" aria-hidden className="w-full overflow-visible">
        {SEGMENT_COLORS.map((color, index) => {
          const from = -SWEEP / 2 + index * segment + GAP / 2;
          return (
            <path
              key={color}
              d={arcPath(from, from + segment - GAP)}
              stroke={color}
              strokeWidth={16}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <g className="gauge-needle" style={{ "--needle-angle": `${needleAngle}deg` } as React.CSSProperties}>
          <path d={`M ${CENTER - 7} ${CENTER} L ${CENTER} ${CENTER - 56} L ${CENTER + 7} ${CENTER} Z`} fill="var(--navy)" />
          <circle cx={CENTER} cy={CENTER} r={9} fill="var(--navy)" />
        </g>
        <text
          x={CENTER}
          y={158}
          textAnchor="middle"
          className="fill-navy text-[17px] font-semibold tabular-nums"
        >
          {score} / {maxScore}
        </text>
      </svg>
      <figcaption className="sr-only">
        Score {score} out of {maxScore}
      </figcaption>
    </figure>
  );
}
