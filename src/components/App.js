import React, { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

import Screenshot from './Screenshot';
import StuffToLookAt from './StuffToLookAt';

/**
 * Functional component
 */
function App() {
  const imageContainerRef = useRef(null);
  return (
    <div className='mx-auto py-8 flex flex-col items-center'>
      <Screenshot imageContainerRef={imageContainerRef} />
      <StuffToLookAt />
      <div className='container' ref={imageContainerRef}></div>
      <Toaster />
    </div>
  );
}

export default App;
