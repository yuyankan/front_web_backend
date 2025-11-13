// types.ts

// types.ts

/**
 * 对应后端数据库或 df_meta 中的一条记录。
 * 包含用于筛选和高层概览的信息。
 */

//meta for tracing
export interface RawDataMeta {
  //id: string; // 唯一ID，用于与 detail_data 关联
  //roll_width_mm: number;
  //flaw_number: number;
  //roll_length_m: number;
  //lot: string;
  //line_speed_m_min: number;
  reportdate: string;
  product:string;
  roll_number: string;
  production_line: string;
  //country: string;
  [key: string]: string; // This allows indexing by a string key
}

//all data for showing
export interface RawDataAll {
  id: number; // 唯一ID，用于与 detail_data 关联
  roll_width_mm: number;
  roll_length_m: number;
  flaw_number: number;
  lot: string;
  line_speed_m_min: number;
  reportdate: string;
  product:string;
  roll_number: string;
  production_line: string;
  country: string;
  productid: number;
  flaw_type: string;
  flaw_area: number;
  flaw_length: number;
  flaw_width: number;
  image_url: string;
  area_avg: number;
  area_std: number;
  corssweb_position_mm: number; // 比如 downweb_position_m: x
  downweb_position_m: number; // 比如 corssweb_position_mm:y
  flaw_id: number;
  //[key: string]: string | number; // This allows indexing by a string key

}

/**
 * 对应后端数据库或 df_detail 中的一条记录。
 * 包含具体的缺陷位置和尺寸信息。
 */
//only detail data
export interface RawDetailData {
  id: string; // 缺陷的唯一ID
  product_id: string; // 关联到 RawMetaData.id 的外键
  flaw_id: string;
  length: number;
  width: number;
  flaw_area: number;
  downweb_position_m: number;
  corssweb_position_mm: number;
}

export interface SelectedOptions {
  production_line: string;
  reportdate: string;
  product: string;
  roll_number: string;
  startDate: string;
  endDate: string;
  [key: string]: string; // This allows indexing by a string key
}

export interface DropdownOptions {
  production_lines: string[];
  reportdates:string[];
  //reportdates_start: ["2024-01-01", "2024-01-05"],
  //reportdates_end: ["2024-01-10", "2024-01-15"],
  products: string[];
  roll_numbers: string[];
  [key: string]: string[];
}

export interface ScatterPointData {
  id: number;//rawdetail id
  corssweb_position_mm: number; // 比如 downweb_position_m: x
  downweb_position_m: number; // 比如 corssweb_position_mm:y
  flaw_type: string;
  flaw_area: number;
  roll_length_m:number;
  roll_width_mm: number;
  flaw_id: number;
  image_url: string;
}

export interface AggregatedTableData {
  reportdate: string;
  roll_number: string;
  area_category: string;
  flaw_numbers: number;
  product:string;
  lot: string;
  flaw_type: string;
  area_catogary: string;
  area_range: string;
}



export interface PreviewImageData {
  id:number;
  image_url: string;
  flaw_type: string;
  area: number;
}

// 预览组件需要的数据
export interface FlawDetail {
  id: number;
  flaw_id: string;
  length: number;
  width: number;
  area: number;
}

