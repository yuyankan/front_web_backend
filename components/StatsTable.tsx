import type { Point } from "../types";



interface StatsTableProps {
  points: Point[];
  setSelected: (p: Point) => void;
  style?: React.CSSProperties; // ✅ 可选
}

export default function StatsTable({ points, setSelected }: StatsTableProps) {
  return (
    <div style={{ flex: 1, background: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", overflow: "auto" }}>
      <h3>统计表</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
              <td>{p.id}</td>
              <td>{p.name || `Category ${p.id}`}</td>
              <td>{p.value || Math.round(Math.random() * 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
