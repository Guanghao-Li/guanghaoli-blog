"use client";

interface CircularAngleRangePickerProps {
  minAngle: number;
  maxAngle: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  size?: number;
}

/** 0° = 正右方, 90° = 正上方, 180° = 正左方, 270° = 正下方。Y 轴反转以适配屏幕坐标系与物理引擎 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z",
  ].join(" ");
  return d;
}

export default function CircularAngleRangePicker({
  minAngle,
  maxAngle,
  onMinChange,
  onMaxChange,
  size = 192,
}: CircularAngleRangePickerProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 12;

  const startDeg = Math.min(minAngle, maxAngle);
  const endDeg = Math.max(minAngle, maxAngle);
  const sectorD = describeArc(cx, cy, radius, startDeg, endDeg);

  return (
    <div className="space-y-5">
      {/* 可视化雷达区域 */}
      <div className="flex justify-center">
        <div className="w-48 h-48 shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/50"
          >
            {/* 虚线圆 - 360° 全域 */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="6 4"
              className="text-zinc-300 dark:text-zinc-600"
            />
            {/* 发射区域扇形 */}
            <path
              d={sectorD}
              className="fill-blue-500/30 stroke-blue-500 stroke-2"
              strokeLinejoin="round"
            />
            {/* 中心小圆点 - 代表头像 */}
            <circle
              cx={cx}
              cy={cy}
              r={4}
              fill="currentColor"
              className="text-zinc-500 dark:text-zinc-400"
            />
          </svg>
        </div>
      </div>

      {/* 控制中枢 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            最小角度: {minAngle}°
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={minAngle}
            onChange={(e) => onMinChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            最大角度: {maxAngle}°
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={maxAngle}
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
