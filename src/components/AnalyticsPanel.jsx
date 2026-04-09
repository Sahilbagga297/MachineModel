import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const MAX_PTS = 30;

const TABS = [
  { key: 'temperature', label: 'Temp',   unit: '°C', color: '#f97316', grad: '#f9731625' },
  { key: 'vibration',   label: 'Vibr',   unit: 'g',  color: '#a855f7', grad: '#a855f725' },
  { key: 'failureRisk', label: 'Risk',   unit: '%',  color: '#ef4444', grad: '#ef444425' },
  { key: 'rpm',         label: 'RPM',    unit: '',   color: '#38bdf8', grad: '#38bdf825' },
  { key: 'humidity',    label: 'Humid',  unit: '%',  color: '#22d3ee', grad: '#22d3ee25' },
];

export default function AnalyticsPanel({ machineData, selectedId }) {
  const [history, setHistory] = useState([]);
  const [tab, setTab]         = useState('temperature');

  useEffect(() => {
    const m = machineData.find((d) => d.id === (selectedId ?? machineData[0]?.id));
    if (!m) return;
    setHistory((prev) => [
      ...prev,
      {
        t:           new Date().toLocaleTimeString('en', { hour12: false }),
        temperature: m.temperature,
        vibration:   +m.vibration.toFixed(3),
        failureRisk: m.failureRisk,
        rpm:         m.rpm,
        humidity:    m.humidity,
      },
    ].slice(-MAX_PTS));
  }, [machineData, selectedId]);

  const conf = TABS.find((t) => t.key === tab);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="text-xs rounded-xl px-3 py-2"
        style={{ background: '#060e1c', border: `1px solid ${conf.color}50`, boxShadow: `0 4px 20px rgba(0,0,0,0.7)` }}>
        <p className="text-slate-500 mb-1 font-mono">{label}</p>
        <p className="font-bold" style={{ color: conf.color }}>{payload[0].value}{conf.unit}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        height: 210,
        background: 'rgba(6,14,28,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #0f2a45',
      }}
    >
      {/* Header row */}
      <div className="flex items-center px-4 pt-2.5 pb-1 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-medium">Analytics</span>
          {selectedId && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-mono"
              style={{ background: '#38bdf815', color: '#38bdf8', border: '1px solid #38bdf830' }}
            >
              {selectedId}
            </span>
          )}
        </div>

        {/* All-machine mini status dots */}
        <div className="flex items-center gap-1.5 ml-2">
          {machineData.map((m) => (
            <div
              key={m.id}
              title={m.label}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: m.status === 'Critical' ? '#ef4444' : m.status === 'Warning' ? '#eab308' : '#22c55e',
                boxShadow: m.status === 'Critical' ? '0 0 5px #ef4444' : 'none',
              }}
            />
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 ml-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: tab === t.key ? `${t.color}18` : 'transparent',
                color:      tab === t.key ? t.color : '#475569',
                border:     `1px solid ${tab === t.key ? t.color + '45' : 'transparent'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 155, paddingLeft: 6, paddingRight: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 5, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id={`ag-${tab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={conf.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={conf.color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#0f2a45" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: '#2d4a6a', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#2d4a6a', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: conf.color, strokeWidth: 1, strokeOpacity: 0.4 }} />
            <Area
              type="monotone"
              dataKey={conf.key}
              stroke={conf.color}
              strokeWidth={2}
              fill={`url(#ag-${tab})`}
              dot={false}
              activeDot={{ r: 5, fill: conf.color, stroke: '#060e1c', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
