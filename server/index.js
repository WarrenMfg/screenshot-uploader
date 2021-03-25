/* eslint-disable no-console */

const express = require('express');
const morgan = require('morgan');
const { writeFile } = require('fs').promises;

const PORT = process.env.PORT || 5500;
const app = express();

// middleware
app.use(express.text({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(express.static('public'));

// ENDPOINT
app.post('/api/screenshot', async (req, res) => {
  try {
    // ideally post data string to a logger, or upload .png to AWS S3 bucket, or similar
    await writeFile(
      `./screenshots/screenshot-${Date.now()}.png`,
      Buffer.from(req.body.split('base64,')[1], 'base64')
    );
    res.send({ message: 'Screenshot uploaded successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// listen
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
