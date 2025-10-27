import Selectorui from "./Selector";
import { UseDataSelectionsdata } from './useDataSelections'; // 引入优化的 Hook
import {fetch_data_options,getMetaData_1day} from '../apiservice'

import { useState, useEffect } from "react";
import type { Point } from "../types";
import Header from "./Header";

import StatsTable from "./StatsTable";
import ScatterPlot from "./ScatterPlot";
import DetailTable from "./DetailTable";
import ImagePreview from "./ImagePreview";

export default function Dashboard() {
  const [source, setSource] = useState("数据源 A");
  const [timeRange, setTimeRange] = useState("本日");
  const [points, setPoints] = useState<Point[]>([]);
  const [selected, setSelected] = useState<Point | null>(null);



    return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" , width: "100vw" }}>
      
    { /* Header */}
      <Header />

     

      {/* Selector */}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <Selectorui />
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

