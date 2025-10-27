// useData.ts
import { useState, useEffect } from 'react';
import type { RawDataAll, AggregatedTableData } from '../types';
import { fetch_data_options, getMetaData_1day } from '../apiservice';
import type {UseDataSelectionsdata } from './useDataSelections';

interface UseDataReturn {
  data: {
    feacheddata_all: RawDataAll[];
    show_aggreatedtabledata: AggregatedTableData[];
  };
  isLoading: boolean;
}

export const useData = (selectddata: UseDataSelectionsdata): UseDataReturn => {
  const [data, setData] = useState<UseDataReturn['data']>({
    feacheddata_all: [],
    show_aggreatedtabledata: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let feacheddata_all: RawDataAll[];
      let show_aggreatedtabledata: AggregatedTableData[];

      // 根据 selected.traceMode 来判断模式
      if (selectddata.traceMode) {
        ({ feacheddata_all, show_aggreatedtabledata } = await fetch_data_options(selectddata.selected));
      } else {
        ({ feacheddata_all, show_aggreatedtabledata } = await getMetaData_1day(selectddata.selected.production_line));
      }

      setData({ feacheddata_all, show_aggreatedtabledata });
      setIsLoading(false);
    };

    fetchData();

    // 将 selected 作为依赖项，当它变化时重新运行
  }, [selectddata]);

  return { data, isLoading };
};