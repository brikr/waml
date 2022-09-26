class Logger {
  public debugMode = false;

  public debug(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) {
      console.debug(message, ...optionalParams);
    }
  }

  public log(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}

export const logger = new Logger();
