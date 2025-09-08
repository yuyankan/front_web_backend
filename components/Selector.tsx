interface SelectorProps {
  source: string;
  setSource: (v: string) => void;
  timeRange: string;
  setTimeRange: (v: string) => void;
}

export default function Selector({ source, setSource, timeRange, setTimeRange }: SelectorProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "60px", padding: "10px 0" }}>
      <label>
        Time:
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ marginLeft: "5px", padding: "5px" }}>
          <option>本日</option>
          <option>本周</option>
          <option>本月</option>
        </select>
      </label>
      <label>
        数据源:
        <select value={source} onChange={(e) => setSource(e.target.value)} style={{ marginLeft: "5px", padding: "5px" }}>
          <option>数据源 A</option>
          <option>数据源 B</option>
          <option>数据源 C</option>
        </select>
      </label>
    </div>
  );
}
