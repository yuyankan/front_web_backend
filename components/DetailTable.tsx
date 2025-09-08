import type{ Point } from "../types";

interface DetailTableProps {
  selected: Point | null;
}

export default function DetailTable({ selected }: DetailTableProps) {
  return (
    <div style={{ flex: 1, background: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", overflow: "auto" }}>
      <h3>明细表</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {selected ? (
            <tr>
              <td>{selected.id}</td>
              <td>{selected.name}</td>
              <td>{selected.value || Math.round(Math.random() * 100)}</td>
            </tr>
          ) : (
            <tr><td colSpan={3} style={{ textAlign: "center", color: "#999" }}>暂无数据</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
