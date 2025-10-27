// useDataSelections.ts
import { useState, useEffect, useCallback } from 'react';
import type { RawDataMeta, SelectedOptions, DropdownOptions } from '../types';
import { fetch_all_RawMetaData, fetchFilteredData, extractedOptions } from '../apiservice';
import { useGlobalContext } from './GlobalContext';

export const useDataSelections = () => {
  const { selected, traceMode, setOptions, setIsLoading } = useGlobalContext();

  const [allData, setAllData] = useState<RawDataMeta[]>([]); // 缓存全量数据

  // 1️⃣ 页面首次加载时获取全量数据，只执行一次
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const data = await fetch_all_RawMetaData();
        setAllData(data);
      } catch (err) {
        console.error('Failed to fetch all data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [setIsLoading]);

  // 2️⃣ 根据 traceMode / selected 更新下拉框选项
  const fetchData = useCallback(async () => {
    if (!allData.length) return; // 全量数据未加载完成时直接返回
    setIsLoading(true);
    try {
      // 先更新生产线选项
      setOptions(prev => ({
        ...prev,
        production_lines: [...new Set(allData.map(item => item.production_line))],
      }));

      if (traceMode) {
        // 追踪模式：按 selected 过滤
        const queryParams: Partial<SelectedOptions> = { ...selected };
        Object.keys(queryParams).forEach(
          key => queryParams[key as keyof SelectedOptions] === '' && delete queryParams[key as keyof SelectedOptions]
        );

        const filtered = fetchFilteredData(allData, queryParams);
        const filteredOptions = extractedOptions(filtered);
        setOptions(prev => ({ ...prev, ...filteredOptions }));
      } else {
        // 实时模式：仅按生产线过滤
        const filtered = allData.filter(d => d.production_line === selected.production_line);
        const optionsFiltered = extractedOptions(filtered);
        setOptions(prev => ({ ...prev, ...optionsFiltered }));
      }
    } catch (err) {
      console.error('Error fetching options:', err);
    } finally {
      setIsLoading(false);
    }
  }, [allData, selected, traceMode, setOptions, setIsLoading]);

  // 3️⃣ 初始加载 + 定时刷新（实时模式）
  useEffect(() => {
    console.log('selected:',selected)
    fetchData();

    if (!traceMode) {
      const intervalId = setInterval(fetchData, 300000); // 5 分钟刷新一次
      return () => clearInterval(intervalId);
    }
  }, [fetchData, traceMode]);

  return { fetchData }; // 可以返回 fetchData 供外部手动调用
};
