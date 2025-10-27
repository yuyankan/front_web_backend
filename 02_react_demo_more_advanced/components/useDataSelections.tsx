// useDataSelections.ts
import { useEffect, useCallback ,useRef} from 'react';
import type { ScatterPointData,RawDataMeta, SelectedOptions, RawDataAll,AggregatedTableData } from '../types';
import { fetch_all_RawMetaData, fetchFilteredData, extractedOptions,getdata_selected, getMetaData_1day} from '../apiservice';
import { useGlobalContext } from './GlobalContext';

export const useInitializeMeta = () => {
  console.log('usedataselections-----------------------')
  const {setMeta, setIsLoading, options,setOptions } = useGlobalContext();

  //const [allData, setMetaata] = useState<RawDataMeta[]>([]); // 缓存全量数据

  // 1️⃣ 页面首次加载时获取全量数据，只执行一次
  const fetchAllData = async () => {
      console.log('------------------INITIALIZE: METADATA READING------------------')
      setIsLoading(true);
   
      try {
        const data: RawDataMeta[]= await fetch_all_RawMetaData();
        setMeta(data);//异步更新到allMeta
        
        // 先更新生产线选项
      /* setOptions(prev => ({
          ...prev,
          production_lines: data.length > 0 
            ? [...new Set(data.map(item => item.production_line))] as string[]
            : prev.production_lines, // 保留 K1
        }));*/
        const filteredOptions = extractedOptions(data);
        setOptions(prev => ({ ...prev, ...filteredOptions }));
      } catch (err) {
        console.error('Failed to fetch all data:', err);
      } finally {

          setIsLoading(false);
      }
    };
  useEffect(() => {
    fetchAllData();
    console.log('finish initialize: ',options)
  }, []);//首次加载

   

}
//update options to initial
export const useRefreshOption = () => {
  const {selected,options, setSelected,cleanButton, allMeta, setIsLoading, setOptions } = useGlobalContext();

  const refreshOption = useCallback(() => {
    console.log('------------------refreshOption------------------');
    setIsLoading(true);
    //set selective to empty:
    const selected_empty: SelectedOptions = {
        reportdate: "",
        product: "",
        roll_number: "",
        production_line: "",
      };
      //set selected to empy
    setSelected(selected_empty);
    

    //set options to initial
    const filteredOptions = extractedOptions(allMeta);
    setOptions(prev => ({ ...prev, ...filteredOptions }));
    console.log('---------------************queryParams************----------',{selected_empty, filteredOptions})
    setIsLoading(false);
  }, [allMeta, setIsLoading, setOptions]);

  // 响应 cleanButton 点击刷新 options
  useEffect(() => {
    if (cleanButton !== undefined) { 
      refreshOption();
    }
  }, [cleanButton, refreshOption]); // 🔑 依赖 refreshOption
};


 // update options when selected change 
export const useUpdateOptions = () => {
  console.log('usedataselections-----------------------')
  const {allMeta, selected, traceMode,  setIsLoading,setOptions } = useGlobalContext();


  // 2️⃣ 根据 traceMode / selected 更新下拉框选项: only for tracemode
  const fetchData_option = useCallback(async () => {
    if (!allMeta.length) return; // 全量数据未加载完成时直接返回
    setIsLoading(true);
    try {

      // 追踪模式：按 selected 过滤
      const queryParams: Partial<SelectedOptions> = { ...selected };
      console.log('---------------************queryParams************----------',queryParams,selected)
      Object.keys(queryParams).forEach(
        key => queryParams[key as keyof SelectedOptions] === '' && delete queryParams[key as keyof SelectedOptions]
      );

      const filtered = fetchFilteredData(allMeta, queryParams);
      
      const filteredOptions = extractedOptions(filtered);
      setOptions(prev => ({ ...prev, ...filteredOptions }));
      
    } catch (err) {
      console.error('Error fetching options:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selected]);

  //update options
  useEffect(() => {
    if(traceMode){
      console.log('updating options');
      fetchData_option();
    }

  },[traceMode,fetchData_option])
  ;
}

export const useUpdateData2Show = () => {
  const {selected, traceMode,  setIsLoading, setAllData,setAggData,tracebutton } = useGlobalContext();

  //get corresponding detail data when selected change: and button -clicked
  //const lastRefreshedSelected = useRef(selected);
  const lastRefreshButton = useRef(tracebutton);



  const fetchData_selected_realtime = async () => {
    console.log('!!!!-!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-')
    console.log('!!!!------fetchData_selected_realtime--------', tracebutton)
    setIsLoading(true);
    try {
        let res: { feacheddata_all: RawDataAll[]; show_aggreatedtabledata: AggregatedTableData[] };
        if (traceMode) {
          
            res = await getdata_selected(selected);
        } else {
            res = await getMetaData_1day(selected.production_line);
        }
        setAllData(res.feacheddata_all ?? []);
        setAggData(res.show_aggreatedtabledata ?? []);
        console.log('!!!!data fached: ----:', res)
    } catch (err) {
        console.error("Error fetching data:", err);
        setAllData([]);
        setAggData([]);
    } finally {
        setIsLoading(false);
    }
}; // 依赖项：traceMode和selected

  // 定时刷新模式
  useEffect(() => {
    if (traceMode) return;
    console.log('✅ 定时刷新模式：启动定时器');
    fetchData_selected_realtime(); // 首次加载
    const intervalId = setInterval(fetchData_selected_realtime, 300000);
    return () => clearInterval(intervalId);
  }, [traceMode]);

  // 追踪模式
  useEffect(() => {
    const shouldFetch =
    traceMode
      ? tracebutton !== lastRefreshButton.current: false
    if (!shouldFetch) return;
    console.log('✅ 追踪模式：监听按钮点击和 selected 变化');
    fetchData_selected_realtime();
    lastRefreshButton.current = tracebutton;
  }, [tracebutton, selected]);
}

//update scatterplot data
export const useUpdateData2Scatt = () => {
  const {feacheddata_all, setScatterdata, roll_max, setRollmaxNumber} = useGlobalContext();
  
  const lastRollNumber = useRef(roll_max);

  useEffect(() => {
    
    const roll_max_temp = feacheddata_all.length > 0
      ? Math.max(...feacheddata_all.map(item => parseInt(item.roll_number)))
      : 0;

    // Find the maximum roll_number
    if(lastRollNumber.current==roll_max_temp) return;
      // Filter the array to get items with the maximum roll_number
    const filtered_data  = feacheddata_all.filter(item => parseInt(item.roll_number) === roll_max_temp);
    const data_temp:ScatterPointData[] = filtered_data.map(item => ({
        corssweb_position_mm: item.corssweb_position_mm,
        downweb_position_m: item.downweb_position_m,
        flaw_type: item.flaw_type,
        flaw_area: item.flaw_area,
        roll_length_m: item.roll_length_m,
        roll_width_mm: item.roll_width_mm,
        id: item.id,
        flaw_id: item.flaw_id,
        image_url: item.image_url
    }));
    setRollmaxNumber(roll_max_temp);
    setScatterdata(data_temp);
    lastRollNumber.current=roll_max_temp;//could only use temp data here, as update is asyn
    console.log('setScatterdata updated----------------:',roll_max_temp,roll_max,data_temp);

  }, [feacheddata_all]);


  }
