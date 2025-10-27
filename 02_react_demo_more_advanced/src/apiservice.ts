// apiService.ts
import type { DropdownOptions, RawDataMeta, RawDataAll, AggregatedTableData, SelectedOptions } from "./types";

/**
 * ---------- 模块级缓存 ----------
 */
let cached1DayData: RawDataAll[] = [];
let cached1DayAggregated: AggregatedTableData[] = [];
let lastProductionLine = "";

let cachedSelectedData: RawDataAll[] = [];
let cachedSelectedAggregated: AggregatedTableData[] = [];
let lastSelectedOptions: SelectedOptions | null = null;

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
export const fetchFilteredData = (fullData: RawDataMeta[], queryParams: Partial<SelectedOptions>): RawDataMeta[] => {
  return fullData.filter(item =>
    Object.entries(queryParams).every(([k, v]) => !v || item[k] === v)
  );
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
  lastProductionLine = production_line;
  console.log('fetchData_1day:data',data)

  return { feacheddata_all: cached1DayData, show_aggreatedtabledata: cached1DayAggregated };
};

export const getdata_selected = async (selected: SelectedOptions) => {
  // 简单深比较
  //const sameSelected = JSON.stringify(selected) === JSON.stringify(lastSelectedOptions);
  //if (sameSelected && cachedSelectedData.length) {
  //  return { feacheddata_all: cachedSelectedData, show_aggreatedtabledata: cachedSelectedAggregated };
  //}
  console.log('getdata_selected,',getdata_selected)
  const data = await fetch_data_options(selected);
  cachedSelectedData = data?.raw_meta_data || [];
  cachedSelectedAggregated = data?.other_data || [];
  lastSelectedOptions = selected;

  return { feacheddata_all: cachedSelectedData, show_aggreatedtabledata: cachedSelectedAggregated };
};
