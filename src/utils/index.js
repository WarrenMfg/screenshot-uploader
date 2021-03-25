/* eslint-disable no-console */
import toast from 'react-hot-toast';

/**
 * Handles fetch API errors
 *
 * @param res The response from the fetch request
 */
export const handleErrors = async res => {
  if (!res.ok) {
    throw res.headers.get('Content-Type').includes('json')
      ? await res.json()
      : await res.text();
  } else {
    return res.headers.get('Content-Type').includes('json')
      ? res.json()
      : res.text();
  }
};

/**
 * Handles screenshot after user consent
 */
export const handleScreenshot = async () => {
  const video = document.createElement('video');
  video.autoplay = true;
  let captureStream;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    video.srcObject = captureStream;
  } catch (err) {
    console.error(err);
    // notify user
    return;
  }

  // when ready
  video.onplay = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    try {
      // wait for confirmation popup to disappear
      await new Promise(resolve => setTimeout(resolve, 500));

      // draw video on canvas
      context.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight,
        0,
        0,
        video.videoWidth,
        video.videoHeight
      );

      // get screenshot
      const screenshot = canvas.toDataURL('image/png');

      // stop stream
      captureStream.getVideoTracks().forEach(track => track.stop());

      // POST to API
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: screenshot
      });
      const { message } = await handleErrors(response);

      // update DOM for demonstration purposes
      const img = new Image();
      img.src = screenshot;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.boxShadow = '0 0 20px 0 gray';
      img.classList.add('mb-4');
      document.querySelector('#container').prepend(img);

      // toast
      const toastId = toast.success(message);
      setTimeout(() => toast.dismiss(toastId), 3000);
    } catch (error) {
      console.error(error);
    }
  };
};
