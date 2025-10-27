// useDataSelections.ts
import { useState, useEffect, useCallback } from 'react';
import type { DropdownOptions, AggregatedTableData, RawDataMeta, SelectedOptions } from '../types';
import { fetchFilteredData, fetchMetaData, extractedOptions, getMetaData_1day } from '../apiservice';

export interface UseDataSelectionsdata {
  isLoading: boolean;
  traceMode: boolean;
  selected: SelectedOptions;
  options: DropdownOptions;
  setTraceMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<SelectedOptions>>;
}

export const useDataSelections = (): UseDataSelectionsdata => {
  const [selected, setSelected] = useState<SelectedOptions>({
    reportdate: '',
    product: '',
    roll_number: '',
    production_line: 'K1',
  });
  const [options, setOptions] = useState<DropdownOptions>({
    production_lines: [],
    reportdates: [],
    products: [],
    roll_numbers: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [traceMode, setTraceMode] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let meta_filtered: RawDataMeta[] = [];

    // 获取所有元数据以供过滤，只在必要时调用
    const allData: RawDataMeta[] = await fetchMetaData()//.then(res => res.json());
    console.log('test-selected:', selected)
    console.log('test-option:', options)
    
    // 更新生产线选项
    setOptions(prev => ({
        ...prev,
        production_lines: [...new Set(allData.map(item => item.production_line))]
    }));
    console.log(options)

    if (traceMode) {
      // 追踪模式
      // 1. 获取所有可用的筛选选项
      //const fullOptions = extractedOptions(allData);
      setOptions(prev => ({ ...prev, ...allData }));

      // 2. 根据当前已选的项进行过滤
      const queryParams: Partial<SelectedOptions> = { ...selected };
      Object.keys(queryParams).forEach(key => queryParams[key as keyof SelectedOptions] === '' && delete queryParams[key as keyof SelectedOptions]);
      console.log('queryParams:',queryParams)
      meta_filtered = fetchFilteredData(allData, queryParams);
      console.log('meta_filtered',meta_filtered);
      const filteredOptions = extractedOptions(meta_filtered);
      setOptions(prev => ({ ...prev, ...filteredOptions }));

    } else {
      // 实时模式
      // 这里调用只获取当前选中生产线的数据
      // const { feacheddata_all, show_aggreatedtabledata } = await getMetaData_1day(selected.production_line);
      
      // 假设实时模式下只需要更新选项
      const productionLineData = allData.filter(d => d.production_line === selected.production_line);
      const realTimeOptions = extractedOptions(productionLineData);
      setOptions(prev => ({ ...prev, ...realTimeOptions }));
    }
    setIsLoading(false);
  }, [traceMode, selected]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    console.log('test');
    fetchData(); // 初始加载
    if (!traceMode) {
      intervalId = setInterval(fetchData, 50000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, traceMode]);

  return { isLoading, traceMode, selected, options, setTraceMode, setSelected };
};