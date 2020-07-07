module.exports = class {
  constructor(onMessage) {
    this.seq = 0;
    this.onMessage = onMessage;
  }

  message(data) {
    this.onMessage(data, this.seq++);
  }
}
