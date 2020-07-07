const { parse } = require('url');
const ZoomListener = require('./utils/zoom-listener');

const listeners = {};

function caption({ body, url }, res) {
  const { transcript, sequence } = body;
  const zoom = parse(url).query;
  if (!(zoom in listeners)) {
    listeners[zoom] = new ZoomListener(zoom);
  }

  listeners[zoom].message(transcript, sequence);

  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://webcaptioner.com',
  });
  res.send(JSON.stringify({ "message": "received"}));
}

module.exports = (app) => {
  app.put('/transcribe', caption);
  app.post('/transcribe', caption);
}
