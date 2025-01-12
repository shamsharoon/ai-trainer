import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Onboard from "./components/Onboard.tsx";
import MockInterview from "./components/MockInterview.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/mockInterview" element={<MockInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
