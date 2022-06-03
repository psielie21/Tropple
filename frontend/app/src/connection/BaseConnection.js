class BaseConnection {
  constructor() {
    this.stateToken = "CONNECTION";
  }

  receiveId(args) {
    if (args[0] == this.stateToken && args[1] == "ID") {
      return args[2];
    } else {
      return null;
    }
  }
}

export default BaseConnection;
