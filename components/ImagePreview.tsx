import type { Point } from "../types";

interface ImagePreviewProps {
  selected: Point | null;
}

export default function ImagePreview({ selected }: ImagePreviewProps) {
  return (
    <div style={{ width: "250px", background: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
      <h3>图片预览</h3>
      {selected ? (
        <img src={selected.img || `https://picsum.photos/seed/${selected.id}/200/150`} alt="预览" style={{ width: "100%", borderRadius: "8px" }} />
      ) : (
        <p style={{ color: "#999", textAlign: "center" }}>请选择表格或点击散点图查看图片</p>
      )}
    </div>
  );
}
