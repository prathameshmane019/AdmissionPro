"use client"
import React, { useState } from "react";
import axios from "axios";
import Papa from 'papaparse';

const UploadPage = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          setJsonData(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV: ', error);
        }
      });
    }
  };

  const handleUpload = async () => {
    try {
      // Check if jsonData is available
      if (!jsonData) {
        console.error('No JSON data available for upload');
        return;
      }

      // Send jsonData to the server
      const response = await axios.post("/api/upload", { jsonData });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleUpload} disabled={!jsonData}>
        Upload Data
      </button>
      {jsonData && (
        <div>
          <h2>Converted JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
