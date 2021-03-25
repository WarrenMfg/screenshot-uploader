import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

import { handleScreenshot } from '../utils';

/**
 * Button to throw an error
 */
function Screenshot({ imageContainerRef }) {
  /**
   * Click handler that throws an error
   */
  const handleThrowError = () => {
    try {
      throw [
        'Sorry, we encountered an error.',
        'Would you like to send a screenshot?'
      ];
    } catch (error) {
      toast(
        t => (
          <div>
            {error.map((para, i) => (
              <p key={`${t.id}-${i}`}>{para}</p>
            ))}
            <div className='flex justify-between mt-4'>
              <button
                className='w-2/5 bg-green-200 hover:bg-green-500 transition-all rounded-full py-2 px-4 ml-4'
                onClick={() => {
                  toast.remove();
                  handleScreenshot(imageContainerRef);
                }}
              >
                Send
              </button>
              <button
                className='w-2/5 bg-blue-200 hover:bg-blue-500 transition-all rounded-full py-2 px-4 mr-4'
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                Nope
              </button>
            </div>
          </div>
        ),
        {
          duration: 15000
        }
      );
    }
  };

  return (
    <div className='mb-4'>
      <button
        className='bg-red-200 hover:bg-red-500 rounded-full py-2 px-4 transition-all'
        onClick={handleThrowError}
      >
        Throw Error
      </button>
    </div>
  );
}

Screenshot.propTypes = {
  imageContainerRef: PropTypes.object.isRequired
};

export default Screenshot;
