/* eslint-disable no-console */
import toast from 'react-hot-toast';

/**
 * Handles fetch API errors
 *
 * @param res The response from the fetch request
 */
export const handleErrors = async res => {
  if (!res.ok) {
    throw await res.json();
  } else {
    return res.json();
  }
};

/**
 * Handles screenshot after user consent
 */
export const handleScreenshot = async () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.outerWidth;
  canvas.height = window.outerHeight;
  const context = canvas.getContext('2d');

  const video = document.createElement('video');
  video.autoplay = true;

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    video.srcObject = captureStream;
    // when ready
    video.onplay = async () => {
      // wait for popup to disappear
      await new Promise(resolve => setTimeout(resolve, 500));

      context.drawImage(
        video,
        0,
        0,
        window.outerWidth,
        window.outerHeight,
        0,
        0,
        window.outerWidth,
        window.outerHeight
      );

      // stop stream
      captureStream.getVideoTracks().forEach(track => track.stop());
      // get screenshot
      const screenshot = canvas.toDataURL('image/png'); // convert to File and POST as image/png?
      // update DOM
      const img = new Image();
      img.src = screenshot;
      img.style.width = '100%';
      img.style.height = 'auto';
      document.querySelector('#container').prepend(img);
      // POST to API
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: screenshot
      });
      const { message } = await handleErrors(response);

      const toastId = toast.success(message);
      setTimeout(() => toast.dismiss(toastId), 3000);
    };
  } catch (err) {
    console.error(err);
  }
};
