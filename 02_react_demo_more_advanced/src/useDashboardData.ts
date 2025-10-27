// useDashboardData.ts

import { useState, useEffect, useCallback } from 'react';
import type { DropdownOptions,RawMetaData, SelectedOptions,RawDetailData,AggregatedTableData,FlawDetail,PreviewImageData,ScatterPointData,DetailTableRowData } from './types';
import { fetchOptions, fetchLatestData, fetchFilteredData ,getMetaData_1day} from './apiservice';

// 定义 Hook 的返回值类型
interface DashboardData {
  isLoading: boolean;
  selected: SelectedOptions;
  options: DropdownOptions;
  show_aggreatedtabledata:AggregatedTableData[]
  show_detailtableData: FlawDetail[];
  show_scatterData: ScatterPointData[];
  show_imageurl:PreviewImageData[]
  traceMode: boolean;
  feachedmeta:RawMetaData[];
  feacheddetail:RawDetailData[];

  setTraceMode: (mode: boolean) => void;
  setSelected: (updater: (prev: SelectedOptions) => SelectedOptions) => void;
  // ... 其他需要暴露给组件的状态或方法
}

export const useDashboardData = (): DashboardData => {
  // 保持所有状态管理在 Hook 内部
  const [selected, setSelected] = useState<SelectedOptions>({
    reportdate: '',
    product: '',
    roll_number: '',
    production_line: 'K1',
  });
  const [options, setOptions] = useState<DropdownOptions>({
    production_lines: ['K1','C4'],
    reportdates: [],
    products: [],
    roll_numbers: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [traceMode, setTraceMode] = useState(false);
  const [show_detailtableData, setDtableData] = useState<FlawDetail[]>([]);
  const [show_scatterData, setScatterData] = useState<ScatterPointData[]>([]);
  const [show_aggreatedtabledata, setAggData] = useState<AggregatedTableData[]>([]);
  const [show_imageurl, setImageData] = useState<PreviewImageData[]>([]);

  // 将 fetchData 函数封装在 Hook 内部
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    let dataToProcess: RawMetaData[] = [];
    let fetchedOptions: DropdownOptions;

    //get meta for selection or delected
    const queryParams = { ...selected };
    Object.keys(queryParams).forEach(key => queryParams[key] === '' && delete queryParams[key]);
    
    //options could be used
    const optionsData = await fetchOptions(queryParams);

    if (traceMode) {
      // 追溯模式：根据所有选择获取数据
  
      fetchedOptions = optionsData;
      dataToProcess = await fetchFilteredData(queryParams); 
    } else {
      // 实时模式：获取最新数据: current produciton line , today
      const userSelectedPL = selected.production_line;
      const latestData_meta = await getMetaData_1day(userSelectedPL);
      

      fetchedOptions = {
        reportdate: [...new Set(latestData.map(d => d.reportdate.slice(0, 10)))],
        products: [...new Set(dataToProcess.map(d => d.product))],
        roll_numbers: [...new Set(dataToProcess.map(d => d.roll_number))],
        production_lines: ['K1','C4'],
      };
    }

    setOptions(fetchedOptions);
    setTableData(dataToProcess); 
    const maxRollNumber = dataToProcess.reduce((max, item) => item.roll_number > max ? item.roll_number : max, '');
    const currentScatterData = dataToProcess.filter(item => item.roll_number === maxRollNumber);
    setScatterData(currentScatterData);
    
    setIsLoading(false);
  }, [traceMode, selected]); // Hook 的依赖项

  // 在 Hook 内部处理副作用
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (!traceMode) {
      fetchData();
      intervalId = setInterval(fetchData, 5000);
    } else {
      fetchData();
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [traceMode, fetchData]);

  // 暴露给组件的状态和方法
  return {
    isLoading,
    selected,
    options,
    tableData,
    scatterData,
    traceMode,
    setTraceMode,
    setSelected,
  };
};