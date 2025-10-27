import React, { memo } from "react";
import type { AggregatedTableData } from "../types";
import "./StatsTable.css";
import { useGlobalContext } from "./GlobalContext";
//import {useData_all} from "./useDataSelections"

interface StatsTableProps {

  Points: AggregatedTableData[];

}

const StatsTable: React.FC<StatsTableProps> = (props:StatsTableProps) => {
//const StatsTable: React.FC = () => {
  //load data
  //useData_all();
  //const { show_aggreatedtabledata,selected } = useGlobalContext();
  //console.log('111---111', selected)
  const { Points } = props;
  console.log('statable,points', Points)
  
  return (
    <div className="stats-table-container">
      <h3>Aggregated Data Table</h3>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Roll Number</th>
            <th>Flaw Type</th>
            <th>Area Category</th>
            <th>Area Range</th>
            <th>Flaw Count</th>
          </tr>
        </thead>
        <tbody>
          {Points.map((p:AggregatedTableData) => (
            // Use rollNumber as the key since it is unique
            <tr key={`${p.roll_number}_${p.flaw_type}_${p.area_catogary}`}>
              <td>{p.reportdate}</td>
              <td>{p.roll_number}</td>
              <td>{p.flaw_type}</td>
              <td>{p.area_catogary}</td>
              <td>{p.area_range}</td>
              <td>{p.flaw_numbers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(StatsTable);