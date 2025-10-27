// selectorui.tsx
import React from 'react';
import type { SelectedOptions, AggregatedTableData, DropdownOptions } from "../types";

import { useGlobalContext } from './GlobalContext';
//import {useDataSelections} from './useDataSelections'


export interface Selectordata {
  cleanButton:boolean
  setClean: React.Dispatch<React.SetStateAction<boolean>>;
  selected: SelectedOptions;
  setSelected: React.Dispatch<React.SetStateAction<SelectedOptions>>;
  traceMode: boolean;
  tracebutton: number;
  setTraceMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTraceButton: React.Dispatch<React.SetStateAction<number>>;
  show_aggreatedtabledata: AggregatedTableData[];
  isLoading: boolean;
  options: DropdownOptions;
}



//const Selectorui: React.FC<Selectordata> = (Points:Selectordata) => {//Points:Selectordata
const Selectorui: React.FC = () => {//Points:Selectordata

  // 仅调用 Hook 来获取状态和更新函数
  console.log('2222-hhhh-iii-999')
 // useDataSelections();

  console.log('2222-hhhh-iii')
  const { cleanButton, setClean,selected, setSelected, traceMode, setTraceMode, options,isLoading, tracebutton, setTraceButton, show_aggreatedtabledata} = useGlobalContext();//Points;//useGlobalContext();
  
  console.log('selected',selected)


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 使用从 Hook 获得的 setSelected 函数
    setSelected(prev => ({ ...prev, [name]: value }));
  };

  const handleTraceClick = () => {
    setTraceMode(true);
  
  };


  console.log('---------last:selected---------', selected);
  console.log('---------last:traceMode---------', traceMode);
  console.log('---------last:options---------', options);
  console.log('---------last:show_aggreatedtabledata---------', show_aggreatedtabledata);
  //console.log('----------feacheddata_all---------',feacheddata_all)

  return (
    <div>
      <h2>Product Data Dashboard</h2>
      <button onClick={() => setTraceMode(false)} disabled={!traceMode}>
        Enter Real-time Mode
      </button>
      <button onClick={handleTraceClick} disabled={traceMode}>
        Trace Query
      </button>
      <button onClick={() => setTraceButton(tracebutton + 1)} >
        Load Data
      </button>
      <button onClick={() => setClean(!cleanButton)} >
        Refresh Choice
      </button>
      
      {/* Selectors */}
      <div>
        <label>Product Line:
          <select 
            name="production_line" // 修复：name应与SelectedOptions的key一致
            value={selected.production_line} 
            onChange={handleChange} 
            disabled={isLoading }//&& !selectddata.traceMode
          >
            <option value="">Please Select</option>
            {options.production_lines.map((item: string) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        
        {/* Only show other selectors in trace mode */}
        {traceMode && (
          <>
            
            <label>Report Date:
              <select 
                  name="reportdate" 
                  value={selected.reportdate} //defaultValue
                  onChange={handleChange} 
                  //disabled={selectddata.isLoading}
                  disabled={isLoading }//&& !selectddata.traceMode
                  >
                  <option value="">Please Select</option>
                {options.reportdates.map((item: string) => (
                    <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            {'product'}
            <label>Product:
                        {/* ... (Other selectors: product, rollNumber) */}
                    <select 
                      name="product" // 修复：name应与SelectedOptions的key一致
                      value={selected.product} 
                      onChange={handleChange} 
                      disabled={isLoading }//&& !selectddata.traceMode
                    >
                      <option value="">Please Select</option>
                      {options.products.map((item: string) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
              </label>
              {/* ... (Other selectors: product, rollNumber) */}

              <label>Roll Number:
                <select 
                  name="roll_number" // 修复：name应与SelectedOptions的key一致
                  value={selected.roll_number} 
                  onChange={handleChange} 
                  disabled={isLoading}// && !selectddata.traceMode
                >
                  <option value="">Please Select</option>
                  {options.roll_numbers.map((item: string) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
          
            {/* ... (Other selectors: product, rollNumber) */}
          </>
        )}
      </div>

      <hr />

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            {/* 渲染其他组件，例如图表 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selectorui;