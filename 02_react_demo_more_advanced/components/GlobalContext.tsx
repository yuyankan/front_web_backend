// GlobalContext.ts
import * as React from "react";
import type { RawDataMeta,SelectedOptions, AggregatedTableData, RawDataAll, DropdownOptions,ScatterPointData } from "../types";
//import { getdata_selected, getMetaData_1day } from "../apiservice";

interface GlobalState {
  roll_max:number;
  setRollmaxNumber: React.Dispatch<React.SetStateAction<number>>;
  scatterdata: ScatterPointData[];
  setScatterdata:React.Dispatch<React.SetStateAction<ScatterPointData[]>>;
  cleanButton:boolean;
  setClean: React.Dispatch<React.SetStateAction<boolean>>;
  allMeta: RawDataMeta[];
  setMeta:React.Dispatch<React.SetStateAction<RawDataMeta[]>>;
  selected: SelectedOptions;
  setSelected: React.Dispatch<React.SetStateAction<SelectedOptions>>;
  traceMode: boolean;
  tracebutton: number;
  setTraceMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTraceButton: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  show_aggreatedtabledata: AggregatedTableData[];
  feacheddata_all: RawDataAll[];
  isLoading: boolean;
  options: DropdownOptions;
  setOptions: React.Dispatch<React.SetStateAction<DropdownOptions>>;
  setAllData: React.Dispatch<React.SetStateAction<RawDataAll[]>>;
  setAggData: React.Dispatch<React.SetStateAction<AggregatedTableData[]>>;
  selectScatterpoint: ScatterPointData;
  setSelectScatterPoint: React.Dispatch<React.SetStateAction<ScatterPointData>>;
}

// 1️⃣ 创建 context
const GlobalContext = React.createContext<GlobalState | undefined>(undefined);

export const useGlobalContext = (): GlobalState => {

  const ctx = React.useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
  return ctx;
};


// 2️⃣ Provider 组件
export const GlobalProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [selected, setSelected] = React.useState<SelectedOptions>({
    reportdate: "",
    product: "",
    roll_number: "",
    production_line: "K1",
  });

  const [options, setOptions] = React.useState<DropdownOptions>({
    production_lines: ['K1'],
    reportdates: [],
    products: [],
    roll_numbers: [],
  });

  const [tracebutton, setTraceButton] = React.useState(0);
  const [traceMode, setTraceMode] = React.useState(false);
  const [feacheddata_all, setAllData] = React.useState<RawDataAll[]>([]);
  const [show_aggreatedtabledata, setAggData] = React.useState<AggregatedTableData[]>([]);
  const [scatterdata, setScatterdata] = React.useState<ScatterPointData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [allMeta, setMeta] = React.useState<RawDataMeta[]>([])
  const [cleanButton, setClean] = React.useState(false);
  const [roll_max, setRollmaxNumber] =  React.useState(0);
  //const [selectScatterpoint, setSelectScatterPoint] = React.useState<ScatterPointData | null>(null);
  const [selectScatterpoint, setSelectScatterPoint] = React.useState<ScatterPointData>({
        id: 0,//rawdetail id
        corssweb_position_mm: 0, // 比如 downweb_position_m: x
        downweb_position_m: 0, // 比如 corssweb_position_mm:y
        flaw_type: '',
        flaw_area: 0,
        roll_length_m:0,
        roll_width_mm: 0,
        flaw_id: 0,
        image_url:''
      }
    )

  

  // 5️⃣ Memoized context value
  const value = React.useMemo(
    () => ({
      roll_max,
      setRollmaxNumber,
      scatterdata,
      cleanButton,
      setClean,
      allMeta,
      setMeta,
      selected,
      setSelected,
      traceMode,
      setTraceMode,
      show_aggreatedtabledata,
      feacheddata_all,
      isLoading,
      options,
      setOptions,
      setIsLoading,
      tracebutton,
      setTraceButton,
      setAllData,
      setAggData,
      setScatterdata,
      selectScatterpoint,
      setSelectScatterPoint

    }),
    [selectScatterpoint,
      roll_max,scatterdata,
      cleanButton,allMeta, 
      selected,tracebutton, 
      traceMode, show_aggreatedtabledata,
       feacheddata_all, isLoading, options]
  );

    //check option change!!!
  React.useEffect(() => {
  console.log('options updated----------------:', options);
}, [options]);


  

  return <GlobalContext.Provider value={value}>{children ?? null}</GlobalContext.Provider>;
};
