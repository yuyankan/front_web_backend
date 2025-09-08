import type  { Point } from "../types";

interface ScatterPlotProps {
  points: Point[];
  selected: Point | null;
  setSelected: (p: Point) => void;
}

export default function ScatterPlot({ points, selected, setSelected }: ScatterPlotProps) {
  return (
    <div style={{ flex: 1, background: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h3 style={{ position: "absolute", top: 10 }}>图分布 (Scatter Plot)</h3>
      <svg width={400} height={300}  style={{ border: "1px solid #ccc" }}>
        {points.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.area || 8}
            fill={selected?.id === p.id ? "red" : "blue"}
            style={{ cursor: "pointer" }}
            onClick={() => setSelected(p)}
          />
        ))}
      </svg>
    </div>
  );
}
