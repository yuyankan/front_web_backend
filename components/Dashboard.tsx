import { useState, useEffect } from "react";
import type { Point } from "../types";
import Header from "./Header";
import Selector from "./Selector";
import StatsTable from "./StatsTable";
import ScatterPlot from "./ScatterPlot";
import DetailTable from "./DetailTable";
import ImagePreview from "./ImagePreview";

export default function Dashboard() {
  const [source, setSource] = useState("数据源 A");
  const [timeRange, setTimeRange] = useState("本日");
  const [points, setPoints] = useState<Point[]>([]);
  const [selected, setSelected] = useState<Point | null>(null);

  // 模拟获取数据
  //const fetchData = () => {
  const fetchData = (resetSelected = false) => {
    const newPoints: Point[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 50 + Math.random() * 300,
      y: 50 + Math.random() * 200,
      name: `Category ${i}`,
      area: 5 + Math.random() * 10,
      value: Math.round(Math.random() * 100),
      img: `https://picsum.photos/seed/${source}-${i}/200/150`
    }));
    setPoints(newPoints);
    //setSelected(null);
    if (resetSelected) setSelected(null);
  };

  useEffect(() => {
    fetchData();
    //const interval = setInterval(fetchData, 5000);
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, [source, timeRange]);

    return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" , width: "100vw" }}>
      
    { /* Header */}
      <Header />

     

      {/* Selector */}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <Selector
          source={source}
          setSource={setSource}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>

      {/* 中间区域 */}
      <div style={{ flex: 1, display: "flex", gap: "10px", padding: "0 20px" }}>
        {/* 左侧统计表 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          <StatsTable points={points} setSelected={setSelected} />
        </div>

        {/* 右侧散点图 */}
        <div style={{ flex: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <ScatterPlot points={points} selected={selected} setSelected={setSelected} />
        </div>
      </div>

      {/* 下方区域 */}
      <div style={{ flex: 1, display: "flex", gap: "10px", padding: "0 20px" }}>
        <div style={{ flex: 1, height: "100%" }}>
          <DetailTable selected={selected} />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <ImagePreview selected={selected} />
        </div>
      </div>
    </div>
  );
}