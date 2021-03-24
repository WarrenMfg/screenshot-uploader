import React from 'react';
import { Toaster } from 'react-hot-toast';

import Screenshot from './Screenshot';
import StuffToLookAt from './StuffToLookAt';

/**
 * Functional component
 */
function App() {
  return (
    <div className='mx-auto py-8 flex flex-col items-center'>
      <Screenshot />
      <StuffToLookAt />
      <div className='container' id='container'></div>
      <Toaster />
    </div>
  );
}

export default App;
