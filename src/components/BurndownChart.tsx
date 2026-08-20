'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BurndownPoint {
  day: string;
  ideal: number;
  actual: number;
}

interface BurndownChartProps {
  totalPoints: number;
  sprintLengthDays: number;
  completedByDay: number[];
}

export default function BurndownChart({ totalPoints, sprintLengthDays, completedByDay }: BurndownChartProps) {
  const data: BurndownPoint[] = useMemo(() => {
    const points: BurndownPoint[] = [];
    let remaining = totalPoints;

    for (let day = 0; day <= sprintLengthDays; day++) {
      const ideal = Math.max(totalPoints - (totalPoints / sprintLengthDays) * day, 0);
      const completedToday = completedByDay[day] || 0;
      if (day > 0) remaining = Math.max(remaining - completedToday, 0);

      points.push({
        day: day === 0 ? 'Start' : `Day ${day}`,
        ideal: Math.round(ideal * 10) / 10,
        actual: day === 0 ? totalPoints : remaining
      });
    }

    return points;
  }, [totalPoints, sprintLengthDays, completedByDay]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Sprint Burndown</h3>
          <p className="text-xs text-slate-400">Story points remaining vs. ideal pace</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="ideal"
            stroke="#475569"
            strokeDasharray="4 4"
            fill="none"
            name="Ideal"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#6366f1"
            fill="url(#actualFill)"
            name="Actual"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
