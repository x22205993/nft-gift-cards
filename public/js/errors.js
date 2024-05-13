export class WalletConnectError extends Error {
    constructor(message) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, WalletConnectError);
      }
      this.name = "WalletConnectError";
    }
  }