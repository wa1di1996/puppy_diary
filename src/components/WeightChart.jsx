import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'

export function WeightChart({ records, breedData }) {
  const weightRecords = records
    .filter(r => r.type === 'weight' && r.amount)
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      fullDate: r.date,
      weight: parseFloat(r.amount)
    }))
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))

  if (weightRecords.length === 0) {
    return (
      <div className="weight-chart-empty">
        <p>暂无体重记录</p>
        <p className="sub">在记录日常中添加体重记录后，这里会显示图表</p>
      </div>
    )
  }

  const minWeight = Math.min(...weightRecords.map(r => r.weight))
  const maxWeight = Math.max(...weightRecords.map(r => r.weight))
  const latestWeight = weightRecords[weightRecords.length - 1]?.weight

  // 标准体重区间
  const standardMin = breedData?.weight?.min || (latestWeight ? latestWeight * 0.85 : 5)
  const standardMax = breedData?.weight?.max || (latestWeight ? latestWeight * 1.15 : 12)
  const standardMid = breedData?.weight?.standard || ((standardMin + standardMax) / 2)

  const chartData = weightRecords.map(r => ({
    ...r,
    standardMin,
    standardMax,
    standardMid
  }))

  const yMin = Math.min(minWeight, standardMin) - 1
  const yMax = Math.max(maxWeight, standardMax) + 1

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p><strong>{label}</strong></p>
          <p>体重: {data.weight} kg</p>
          {breedData && (
            <p className="sub">标准区间: {standardMin}-{standardMax} kg</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="weight-chart">
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4813a" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#d4813a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="zoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5c9a8" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#f5c9a8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ede8e2" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#a89388' }}
            tickLine={false}
            axisLine={{ stroke: '#ede8e2' }}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#a89388' }}
            tickLine={false}
            axisLine={false}
            unit=" kg"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={standardMax}
            stroke="#d49a2e"
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
          <ReferenceLine
            y={standardMin}
            stroke="#d49a2e"
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
          <ReferenceLine
            y={standardMid}
            stroke="#7a9e7e"
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="standardMax"
            fill="url(#zoneGrad)"
            stroke="none"
          />
          <Area
            type="monotone"
            dataKey="standardMin"
            fill="url(#zoneGrad)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#d4813a"
            strokeWidth={2.5}
            dot={{ fill: '#d4813a', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#b86828', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-line" style={{ background: '#d4813a' }}></span>
          体重记录
        </span>
        <span className="legend-item">
          <span className="legend-line" style={{ background: '#7a9e7e' }}></span>
          标准体重
        </span>
        <span className="legend-item">
          <span className="legend-zone" style={{ background: '#f5c9a8' }}></span>
          标准区间
        </span>
      </div>
    </div>
  )
}
