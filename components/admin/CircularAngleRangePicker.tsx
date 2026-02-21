"use client";

interface CircularAngleRangePickerProps {
  minAngle: number;
  maxAngle: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  size?: number;
}

/** 0° = 右侧, 90° = 上方, 逆时针增加。屏幕 y 向下为正，故 y = cy - r*sin */
function polarToXY(deg: number, r: number, cx: number, cy: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

export default function CircularAngleRangePicker({
  minAngle,
  maxAngle,
  onMinChange,
  onMaxChange,
  size = 140,
}: CircularAngleRangePickerProps) {
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;

  const startDeg = Math.min(minAngle, maxAngle);
  const endDeg = Math.max(minAngle, maxAngle);
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;

  const p1 = polarToXY(startDeg, r, cx, cy);
  const p2 = polarToXY(endDeg, r, cx, cy);

  const d = `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 0 ${p2.x} ${p2.y} Z`;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900"
        >
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-300 dark:text-zinc-600" />
          <path d={d} fill="hsl(var(--accent))" fillOpacity={0.4} stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-zinc-400 dark:text-zinc-500" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">minAngle (°) {minAngle}</label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={minAngle}
            onChange={(e) => onMinChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">maxAngle (°) {maxAngle}</label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={maxAngle}
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
