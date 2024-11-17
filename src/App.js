// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './partials/Preloader';
import Header from './partials/Header';
import HomePage from './Components/HomePage'; // Assuming you have a HomePage component
import AboutPage from './Components/AboutPage'; // Create this component
import ContactPage from './Components/ContactPage'; // Create this component
import Footer from './partials/Footer';

const App = () => {
  return (
    <Router>
      <Preloader />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;