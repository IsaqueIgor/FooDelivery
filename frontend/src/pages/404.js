import React from 'react';
import erro404 from '../assets/404.png';

const error404 = () => (
  <div style={{ textAlign: 'center' }}>
    <p style={{ top: '26%', left: '45%' }}>404 OOPS! PAGE NOT FOUND</p>
    <div style={{ top: '54%', left: '40%' }}>
      <img alt='404' src={erro404} style={{ height: 600, width: 600 }} />
    </div>
  </div>
);

export default error404;
