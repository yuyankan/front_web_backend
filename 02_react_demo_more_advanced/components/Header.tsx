export default function Header() {
  return (
    <header
      style={{
        width: "100%",          // 横向撑满父容器
        boxSizing: "border-box", // 包括 padding 在内的宽度
        padding: "20px 20px",
        background: "#f3f4f6",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "38px", color: "#111827" ,textAlign: "center"}}>
        ISRA REPORT
      </h1>
    </header>
  );
}
