// src/partials/Preloader.js
import React, { useEffect, useState } from 'react';

function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Change this to however long you want the preloader to show

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div id="preloader-active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fff' }}>
          <div className="preloader d-flex align-items-center justify-content-center">
            <div className="preloader-inner position-relative">
              <div className="preloader-circle"></div>
              <div className="preloader-img pere-text">
                <img src="assets/img/logo/logo.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Preloader;