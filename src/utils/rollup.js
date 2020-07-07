module.exports = class {
  constructor(maxLineLength, timeout, join, onMessage) {
    this.maxLineLength = maxLineLength;
    this.timeout = timeout;
    this.join = join;
    this.onMessage = onMessage;

    this.flushTimeoutId = null;
    this.awaitingSend = [];
  }

  message(data) {
    // If there are pending messages, and the line-length would exceed the limit, send the pending messages now
    if (this.awaitingSend.length > 0 && (this.getMessage() + this.join + data).length >= this.maxLineLength) {
      this.sendWaiting();
    }

    // If this is the first thing we're waiting on, start the timer
    if (this.awaitingSend.length === 0) {
      this.flushTimeoutId = setTimeout(() => this.sendWaiting(), this.timeout);
    }

    // Add the data
    this.awaitingSend.push(data);
  }

  sendWaiting() {
    if (this.flushTimeoutId) {
      clearTimeout(this.flushTimeoutId);
      this.flushTimeoutId = null;
    }

    this.onMessage(this.getMessage());
    this.awaitingSend = [];
  }

  getMessage() {
    return this.awaitingSend.join(this.join);
  }
}
