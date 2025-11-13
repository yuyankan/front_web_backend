// apiService.ts
import type { DropdownOptions, RawDataMeta, RawDataAll, AggregatedTableData, SelectedOptions } from "./types";
//import { useGlobalContext } from './components/GlobalContext';

/**
 * ---------- 模块级缓存 ----------
 */
let cached1DayData: RawDataAll[] = [];
let cached1DayAggregated: AggregatedTableData[] = [];
//let lastProductionLine = "";

let cachedSelectedData: RawDataAll[] = [];
let cachedSelectedAggregated: AggregatedTableData[] = [];
//let lastSelectedOptions: SelectedOptions | null = null;

/**
 * ---------- API 调用 ----------
 */
export const fetch_all_RawMetaData = async (): Promise<RawDataMeta[]> => {
  try {
    const res = await fetch("http://localhost:8000/api/meta_data");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()) as RawDataMeta[];
  } catch (error) {
    console.error("Failed to fetch raw meta data:", error);
    return [];
  }
};

export const fetchData_1day = async (production_line: string) => {
  try {
    const url = `http://localhost:8000/api/meta-data1day?production_line=${encodeURIComponent(production_line)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("网络响应出错");
    return await res.json();
  } catch (error) {
    console.error("fetchData_1day error:", error);
    return {};
  }
};

export const fetch_data_options = async (selected: SelectedOptions) => {
  try {
    const res = await fetch("http://localhost:8000/api/data_query_options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("fetch_data_options error:", error);
    return {};
  }
};

/**
 * ---------- 数据处理 ----------
 */
export const fetchFilteredData_old = (fullData: RawDataMeta[], queryParams: Partial<SelectedOptions>): RawDataMeta[] => {
  return fullData.filter(item =>
    Object.entries(queryParams).every(([k, v]) => !v || item[k] === v)
  );
};

/**
 * 将给定的日期字符串转换为本地时区当天午夜 (00:00:00.000) 的 Date 对象。
 * 如果输入为 null, undefined 或无效日期，则返回 null。
 * * @param dateString 输入的日期字符串，或 null，或 undefined。
 * @returns 本地午夜的 Date 对象，或 null。
 */
const getLocalMidnightDate = (dateString: string | null | undefined): Date | null => {
    
    // 1. 处理 null 或 undefined 输入
    if (!dateString) { 
        return null;
    }
    
    // 2. 转换为 Date 对象
    const date = new Date(dateString);
    
    // 3. 防错检查：检查日期是否有效。
    if (isNaN(date.getTime())) {
        console.error(`Invalid date value provided to getLocalMidnightDate: ${dateString}`);
        return null; // 返回 null 而不是无效日期
    }
    
    // 4. 将时间设置为本地时区的 00:00:00.000
    // 这是消除时区差异的关键步骤。
    date.setHours(0, 0, 0, 0); 
    
    return date;
};

/* filter data acc. to selection*/
export const fetchFilteredData = (
  fullData: RawDataMeta[],
  queryParams: Partial<SelectedOptions>

): RawDataMeta[] => {
  const { startDate, endDate, reportdate,...otherParams } = queryParams;
  const startDateLocal = getLocalMidnightDate(startDate);
  const endDateLocal = getLocalMidnightDate(endDate);
  

  return fullData.filter(item => {
    // 假设 item.reportdate 是一个日期字符串或Date对象，可以进行比较
    const itemDate = new Date(item.reportdate); 
    

    // --- 1. 日期区间过滤 ---
    
    // 如果设置了 startdate，则 itemDate 必须大于或等于它
    if (startDateLocal && itemDate < startDateLocal) {
      return false;
    }

    // 如果设置了 endDate，则 itemDate 必须小于或等于它
    if (endDateLocal && itemDate > endDateLocal) {
      return false;
    }
    
    // --- 2. 其他参数过滤 ---
    
    // 过滤掉 startdate 和 endDate 后，对其他参数进行相等比较
    // Object.entries(otherParams) 只包含 production_line, product 等
    return Object.entries(otherParams).every(([key, value]) => {
      // 检查 value 是否存在（非空字符串、非null、非undefined）
      if (value) {
        // key 是 SelectedOptions 的键，但 item[key] 可能是 RawDataMeta 的键
        const itemKey = key as keyof Omit<RawDataMeta, 'reportdate'>;
        return item[itemKey] === value;
      }
      // 如果 value 为空（未选择），则此条件始终为 true，不影响过滤
      return true; 
    });
  });
};

export const extractedOptions = (filteredData: RawDataMeta[]): DropdownOptions => ({
  production_lines: [...new Set(filteredData.map(item => item.production_line))],
  reportdates: [...new Set(filteredData.map(item => item.reportdate))],
  products: [...new Set(filteredData.map(item => item.product))],
  roll_numbers: [...new Set(filteredData.map(item => item.roll_number))],
});

/**
 * ---------- 缓存 + 通用获取函数 ----------
 */
export const getMetaData_1day = async (production_line: string) => {
  //if (production_line === lastProductionLine && cached1DayData.length && cached1DayAggregated.length) {
  //  return { feacheddata_all: cached1DayData, show_aggreatedtabledata: cached1DayAggregated };
  //}

  const data = await fetchData_1day(production_line);
  console.log('**********getMetaData_1day****************',data); 
  cached1DayData = data?.raw_meta_data || [];
  cached1DayAggregated = data?.other_data || [];
  //lastProductionLine = production_line;
  console.log('fetchData_1day:data',data)

  return { feacheddata_all: cached1DayData, show_aggreatedtabledata: cached1DayAggregated };
};

export const getdata_selected = async (selected: SelectedOptions) => {
  // 简单深比较
  //const sameSelected = JSON.stringify(selected) === JSON.stringify(lastSelectedOptions);
  //if (sameSelected && cachedSelectedData.length) {
  //  return { feacheddata_all: cachedSelectedData, show_aggreatedtabledata: cachedSelectedAggregated };
  //}
  console.log('getdata_selected,',selected)
  const data = await fetch_data_options(selected);
  cachedSelectedData = data?.raw_meta_data || [];
  cachedSelectedAggregated = data?.other_data || [];
  //lastSelectedOptions = selected;

  return { feacheddata_all: cachedSelectedData, show_aggreatedtabledata: cachedSelectedAggregated };
};
