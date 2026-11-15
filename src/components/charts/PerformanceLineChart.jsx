import React, { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartColors } from "./chartTheme";

/** Score trend. Data contract is unchanged: [{ label, score }]. */
export default function PerformanceLineChart({ data }) {
  const c = useChartColors();
  const gid = useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.accent} stopOpacity={0.4} />
            <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`stroke-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.accent} />
            <stop offset="100%" stopColor={c.flow} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={c.grid} strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: c.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: c.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={c.tooltipStyle} cursor={{ stroke: c.grid }} />
        <Area
          type="monotone"
          dataKey="score"
          stroke={`url(#stroke-${gid})`}
          strokeWidth={2.75}
          fill={`url(#fill-${gid})`}
          dot={{ r: 4, fill: c.flow, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: c.flow, stroke: c.tooltipBg, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
