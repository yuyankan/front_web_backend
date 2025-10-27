// DetailTable.tsx

import React, { memo } from "react";
import type { ScatterPointData } from "../types";
import "./DetailTable.css";

interface DetailTableProps {
  selectedFlaw: ScatterPointData;
}

const DetailTable: React.FC<DetailTableProps> = (props:DetailTableProps) => {
  const { selectedFlaw } = props;

  //const {selectScatterpoint,setSelectScatterPoint } = useGlobalContext();
  return (
    <div className="detail-table-container">
      <h3>Flaw Details</h3>
      <table className="detail-table">
        <thead>
          <tr>
            <th>Flaw ID</th>
            <th>Flaw Type</th>
            <th>Flaw Area</th>
          </tr>
        </thead>
        <tbody>
          {/* Conditional rendering based on whether a flaw is selected */}
          {selectedFlaw ? (
            <tr>
              <td>{selectedFlaw.flaw_id}</td>
              <td>{selectedFlaw.flaw_type}</td>
              <td>{selectedFlaw.flaw_area}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3} className="no-data-cell">No Data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default memo(DetailTable);
