import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' component={Landing} />
      </div>
    </Router>
  );
}

export default App;
