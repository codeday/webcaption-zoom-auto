const axios = require('axios');
const retry = require('p-retry');
const Rollup = require('./rollup');
const Monotonic = require('./monotonic');

module.exports = class {
  constructor(url) {
    this.url = url;
    const monotonic = new Monotonic((message, seq) => this.sendMessage(message, seq));
    const rollup = new Rollup(60, 400, ' ', (data) => monotonic.message(data));

    this.onMessage = (message, seq) => rollup.message(message, seq);
  }

  message(message, seq) {
    this.onMessage(message, seq);
  }

  sendMessage(message, seq) {
    const url = `${this.url}&seq=${seq}&lang=en-US`;

    const makeRequest = async () => axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'text/plain',
      },
      data: message
    });

    retry(makeRequest, { minRetryTime: 100, maxRetryTime: 1000, retries: 5 });
  }
}
