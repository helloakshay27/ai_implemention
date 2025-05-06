import React from "react";
import { useChatContext } from "../contexts/chatContext";


const BRDTable = () => {
  const {BRDFormData}=useChatContext();
  const formData = BRDFormData;
  console.log(formData);
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    height:"auto",
    backgroundColor: "rgba(233, 235, 235, 0.42)",
  };

  const cellStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "left",
  };

  const boldCell = {
    ...cellStyle,
    fontWeight: "bold",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ backgroundColor: "#f5f5f5" }}>
          <th style={boldCell}>Section</th>
          <th style={boldCell}>Field</th>
          <th style={boldCell}>Input</th>
        </tr>
      </thead>
      <tbody>
        {/* Prompt */}
        <tr>
          <td style={boldCell}>Prompt</td>
          <td style={boldCell}>Purpose of BRD</td>
          <td style={cellStyle}>{formData.prompt}</td>
        </tr>

        {/* Business Objective */}
        <tr>
          <td style={boldCell}>Objective</td>
          <td style={boldCell}>Business Objective</td>
          <td style={cellStyle}>{formData.businessObjective}</td>
        </tr>

        {/* Problem Statement */}
        <tr>
          <td style={boldCell}>Objective</td>
          <td style={boldCell}>Problem Statement</td>
          <td style={cellStyle}>{formData.problemStatement}</td>
        </tr>

        {/* User Roles */}
        <tr>
          <td style={boldCell}>Roles</td>
          <td style={boldCell}>User Roles</td>
          <td style={cellStyle}>{formData.userRoles}</td>
        </tr>

        {/* Features */}
        <tr>
          <td style={boldCell}>Features</td>
          <td style={boldCell}>Feature List</td>
          <td style={cellStyle}>{formData.features}</td>
        </tr>

        {/* Competitors */}
        {formData.competitors?.map((comp, index) => (
          <React.Fragment key={index}>
            <tr>
              <td style={boldCell} rowSpan="4">Competitors</td>
              <td style={boldCell}>{`Competitor ${index + 1}`}</td>
              <td style={cellStyle}>{comp.name}</td>
            </tr>
            <tr>
              <td style={boldCell}>Website</td>
              <td style={cellStyle}>{comp.website}</td>
            </tr>
            <tr>
              <td style={boldCell}>User ID</td>
              <td style={cellStyle}>{comp.username}</td>
            </tr>
            <tr>
              <td style={boldCell}>Password</td>
              <td style={cellStyle}>{comp.password}</td>
            </tr>
          </React.Fragment>
        ))}

        {/* Video Benchmarks */}
        {formData.videoBenchmarks?.map((vb, index) => (
          <React.Fragment key={index}>
            <tr>
              <td style={boldCell} rowSpan="3">Video Benchmarks</td>
              <td style={boldCell}>{`Competitor ${index + 1}`}</td>
              <td style={cellStyle}>{vb.competitor}</td>
            </tr>
            <tr>
              <td style={boldCell}>Feature</td>
              <td style={cellStyle}>{vb.feature}</td>
            </tr>
            <tr>
              <td style={boldCell}>Video Link</td>
              <td style={cellStyle}>{vb.videoLink}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default BRDTable;
