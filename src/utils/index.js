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
  // make video element to pipe in user's browser
  const video = document.createElement('video');
  video.autoplay = true;
  let captureStream;

  try {
    // get input stream
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    // pipe into video element
    video.srcObject = captureStream;
  } catch (err) {
    // stop stream
    captureStream.getVideoTracks().forEach(track => track.stop());
    // notify user
    toast.error('Sorry, we made a boo boo...');
    console.error(err);
    return;
  }

  // when ready
  video.onplay = async () => {
    // make canvas and get context
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    try {
      // wait for streaming confirmation popup to disappear
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
      img.classList.add(
        'mb-4',
        'transform',
        'transition-all',
        'hover:scale-105'
      );
      document.querySelector('#container').prepend(img);

      // notify user
      const toastId = toast.success(message);
      setTimeout(() => toast.dismiss(toastId), 3000);
    } catch (error) {
      // stop stream
      captureStream.getVideoTracks().forEach(track => track.stop());
      // notify user
      toast.error('Sorry, we made a boo boo...');
      console.error(error);
    }
  };
};
