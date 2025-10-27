import Selectorui,{type Selectordata} from "./Selector";

import ImagePreview from "./ImagePreview"
import StatsTable from "./StatsTable"
import DetailTable from "./DetailTable"
import Header from "./Header"
import ScatterPlot from "./ScatterPlot"
import { useGlobalContext } from "./GlobalContext";
import {useInitializeMeta,useRefreshOption,useUpdateData2Show,useUpdateOptions,useUpdateData2Scatt } from "./useDataSelections"


  

export default function Dashboard() {
    //initialize
  useInitializeMeta();
  useRefreshOption();
  useUpdateOptions();
  useUpdateData2Show();
  useUpdateData2Scatt();

  console.log('hi-starting')
  const {
      feacheddata_all,scatterdata,
      cleanButton, setClean,
      selected, setSelected, 
      traceMode, setTraceMode,
      options,isLoading, 
      tracebutton, setTraceButton,
      show_aggreatedtabledata, selectScatterpoint } = useGlobalContext();

  console.log('local selected:', selected); 
  console.log('hi-starting-OOOO',options);
  console.log('hi-starting-feacheddata_all',feacheddata_all);
  console.log('hi-starting-scatterdata',scatterdata);
  const points_selector: Selectordata= {
                  cleanButton, 
                  setClean,
                  selected,
                  setSelected,
                  traceMode,
                  tracebutton,
                  setTraceMode,
                  setTraceButton,
                  show_aggreatedtabledata,
                  isLoading,
                  options
                      }

  console.log('selectScatterpoint',selectScatterpoint)

    return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" , width: "100vw" }}>
  

     <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <Header />
      </div>

      {/* Selector //{...points_selector}*/}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <Selectorui />
      </div>

      {/* 中间区域 */}
      <div style={{ flex: 1, display: "flex", gap: "10px", padding: "0 20px" }}>
        {/* 左侧统计表  */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <StatsTable Points={show_aggreatedtabledata}/>
      </div>
       <div>
        <ScatterPlot/>
        <DetailTable selectedFlaw={selectScatterpoint}/>
        <ImagePreview  selected={selectScatterpoint}/>
       </div>
     
     
       
      </div>

 
    </div>
  );
}

