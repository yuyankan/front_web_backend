import type { ScatterPointData } from "../types";
import { useGlobalContext } from "./GlobalContext";
import { useState} from 'react';



export default function ScatterPlot() {
 
  const {scatterdata, roll_max, selectScatterpoint,setSelectScatterPoint } = useGlobalContext();
  
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPointData | null>(null);

  console.log('ScatterPlot.log',scatterdata)

    // 简单的字符串哈希函数
  const stringToHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // 转换为 32 位整数
    }
    return hash;
  };

  // 根据哈希值生成颜色的函数
  const getFlawTypeColor = (flawType: string): string => {
    if (!flawType) {
      return '#A9A9A9'; // 默认颜色
    }
    // 使用哈希值生成一个 HSL 颜色，确保颜色差异大
    const hash = stringToHash(flawType);
    const hue = Math.abs(hash) % 360; // 色相在0-360度之间
    const saturation = 70; // 饱和度，保持颜色鲜艳
    const lightness = 60; // 亮度，保持颜色明亮
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  //image size
  const svgWidth = 500;
  const svgHeight = 700;

  const dataMaxCrossweb = Math.max(...scatterdata.map(p => p.corssweb_position_mm));
  const dataMaxDownweb = Math.max(...scatterdata.map(p => p.downweb_position_m));
  // Get roll_width and roll_length from the first data point
  const roll_width = scatterdata[0]?.roll_width_mm;
  const roll_length = scatterdata[0]?.roll_length_m;

  // 2. 根据 roll_width 的值来确定最终的缩放基准
  // 你的逻辑: 如果 p.roll_width 不为 null，就用 p.roll_width，否则用数据最大值
  const finalMaxCrossweb = roll_width ?  roll_width : dataMaxCrossweb;
  const finalMaxDownweb = roll_length ? roll_length : dataMaxDownweb;
  // Find the maximum values from the scatterdata


  // Calculate the scale factors
  const scaleX = (svgWidth - 40) / finalMaxCrossweb;
  const scaleY = (svgHeight - 40) / finalMaxDownweb;

  // 4. 获取不重复的 flaw_type 用于图例
  const uniqueFlawTypes = Array.from(new Set(scatterdata.map(p => p.flaw_type)));


  
  return (
    <div style={{
      display: 'flex', // 使用 flex 布局
      background: "#fff",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      alignItems: 'flex-start' // 顶部对齐
    }}>
      {/* 标题 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: '100%' // 确保标题容器占据整个宽度
      }}>
        <h3 style={{ marginTop: 20 }}>FLAW DISTRIBUTION:ROLL {roll_max}</h3>
      </div>
      
      {/* 图表和图例容器 */}
      <div style={{ display: 'flex' }}>
        {/* SVG 图表 */}
        <div style={{ position: 'relative' }}>
          <svg
            width={svgWidth}
            height={svgHeight}
            style={{ border: '1px solid #ccc', background: 'white' }}
          >
            {scatterdata.map((p) => {
              const defaultFillColor = getFlawTypeColor(p.flaw_type);
              const circleRadius = Math.min(p.flaw_area || 8, 20);
              const scaledX = p.corssweb_position_mm * scaleX + 20;
              const scaledY = p.downweb_position_m * scaleY + 20;
              const currentFillColor = selectScatterpoint?.id === p.id
                ? 'red'
                : defaultFillColor;

              return (
                <circle
                  key={p.id}
                  cx={scaledX}
                  cy={scaledY}
                  r={circleRadius}
                  fill={currentFillColor}
                  style={{ cursor: 'pointer', opacity: hoveredPoint?.id === p.id ? 0.8 : 1 }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSelectScatterPoint(p)}
                />
              );
            })}
          </svg>
          
          {/* Tooltip 的渲染 */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                left: hoveredPoint.corssweb_position_mm * scaleX + 20,
                top: hoveredPoint.downweb_position_m * scaleY + 20,
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 10,
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -100%)',
              }}
            >
              <p style={{ margin: 0 }}>Type: {hoveredPoint.flaw_type}</p>
              <p style={{ margin: 0 }}>Area: {hoveredPoint.flaw_area}</p>
            </div>
          )}
        </div>
        
        {/* 图例 */}
        <div style={{
          width: '180px', // 宽度足够显示图例
          padding: '10px',
          marginLeft: '20px'
        }}>
          <h4>Flaw Types</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {uniqueFlawTypes.map(type => (
              <li key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getFlawTypeColor(type),
                    marginRight: '8px'
                  }}
                />
                <span>{type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

