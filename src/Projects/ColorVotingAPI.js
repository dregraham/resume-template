import React, { useEffect, useRef } from "react";
import "./ColorVotingAPI.css"; 
import "../App.css";

const API_ENDPOINT = 'https://tki9q67dsg.execute-api.us-east-2.amazonaws.com';

function ColorVotingAPI() {
  const colorWheelRef = useRef(null);
  const selectedColorRef = useRef(null);
  const colorInfoRef = useRef(null);
  const voteButtonRef = useRef(null);
  const loadingRef = useRef(null);
  const resultsContainerRef = useRef(null);

  useEffect(() => {
    // Move your JS logic here, replacing document.getElementById with refs
    // Example: colorWheelRef.current, selectedColorRef.current, etc.
    // You will need to adapt the code to work with React's lifecycle and refs.
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          zIndex: 2000,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 18px",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "background 0.2s",
        }}
        onClick={() => {
          // Download functionality can be implemented here if needed
        }}
      >
        Download This Project
      </button>
      <h1>Pick Your Favorite Color!</h1>
      <div id="colorWheel" ref={colorWheelRef}></div>
      <div id="selectedColor" ref={selectedColorRef}></div>
      <div id="colorInfo" ref={colorInfoRef}>No color selected</div>
      <button id="voteButton" ref={voteButtonRef}>Submit</button>
      <div id="loading" ref={loadingRef} className="loading">Loading...</div>
      <div id="results">
        <h2>Vote Results</h2>
        <div id="resultsContainer" ref={resultsContainerRef}></div>
      </div>
      {/* Tools Used Section */}
      <div id="toolsUsed" style={{
        margin: "30px 0",
        width: "80%",
        maxWidth: 600,
        background: "#fffbe7",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        padding: 20
      }}>
        <h2 style={{ marginTop: 0 }}>Tools Used</h2>
        <ul style={{ fontSize: 17, color: "#444", lineHeight: 1.7 }}>
          <li>HTML5 &amp; CSS3</li>
          <li>Vanilla JavaScript (ES6+)</li>
          <li>Canvas API (for drawing rainbow and results)</li>
          <li>AWS Lambda &amp; API Gateway (for backend API)</li>
          <li>AWS DynamoDB (for vote storage)</li>
          <li>Fetch API (for HTTP requests)</li>
          <li>VS Code (for development)</li>
        </ul>
      </div>
    </div>
  );
}

export default ColorVotingAPI;