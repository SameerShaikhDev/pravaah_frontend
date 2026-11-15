import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useChartColors } from "./chartTheme";

/** Skill radar. Data contract is unchanged: [{ skill, score }]. */
export default function ScoreRadarChart({ data }) {
  const c = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke={c.grid} />
        <PolarAngleAxis dataKey="skill" tick={{ fill: c.tick, fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} />
        <Radar dataKey="score" stroke={c.accent} strokeWidth={2} fill={c.accent} fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
