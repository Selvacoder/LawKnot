import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DocumentAnalysis from './pages/DocumentAnalysis';
import AIAssistant from './pages/AIAssistant';
import Forum from './pages/Forum';
import CaseResearch from './pages/CaseResearch';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/document-analysis" element={<DocumentAnalysis />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/case-research" element={<CaseResearch />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;